const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const parseExcel = require("../services/parseExcel");
const { analyzeWithGemini } = require("../services/geminiClient");
const { aggregateData } = require("../services/aggregator");

const router = express.Router();

// 🗂️ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `upload-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 📁 File filter & size limits
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.ms-excel.sheet.macroEnabled.12"
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Only Excel (.xlsx, .xls) or CSV files are allowed. Received: ${file.mimetype}`), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// 📤 Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        ok: false,
        error: "No file uploaded. Please select an Excel or CSV file." 
      });
    }

    filePath = req.file.path;
    console.log("📄 Processing file:", filePath);
    console.log("📋 File details:", {
      originalName: req.file.originalname,
      size: (req.file.size / 1024 / 1024).toFixed(2) + ' MB',
      mimetype: req.file.mimetype
    });

    // Step 1️⃣ Read file as buffer
    const buffer = fs.readFileSync(filePath);

    // Step 2️⃣ Parse Excel file
    const parsedData = await parseExcel(buffer, req.file.originalname);
    
    if (!parsedData || parsedData.length === 0) {
      throw new Error("No data found in the Excel file. Please check the file format.");
    }

    console.log(`✅ Successfully parsed ${parsedData.length} records`);

    // Step 3️⃣ Aggregate data (NO MongoDB dependency)
    const aggregatedData = aggregateData(parsedData);
    console.log("✅ Data aggregation completed");

    // Step 4️⃣ Analyze with Gemini
    console.log("🤖 Sending data to Gemini for analysis...");
    const analysis = await analyzeWithGemini(aggregatedData);
    console.log("✅ Gemini analysis completed");

    // Step 5️⃣ Cleanup uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🧹 Temporary file cleaned up");
    }

    // Step 6️⃣ Return successful response
    return res.json({
      ok: true,
      data: {
        analysis,
        summary: aggregatedData.summary,
        topApps: aggregatedData.topApps,
        categories: aggregatedData.categories,
        rawSample: parsedData.slice(0, 5), // sample for preview
        totalRecords: parsedData.length
      },
      message: `Successfully analyzed ${parsedData.length} activities`
    });

  } catch (error) {
    console.error("❌ Upload processing error:", error.message);

    // Cleanup file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("🧹 Cleared temporary file after error");
      } catch (cleanupError) {
        console.warn("Could not delete temp file:", cleanupError.message);
      }
    }

    // User-friendly error messages
    let userMessage = error.message;
    if (error.message.includes('parse') || error.message.includes('Excel')) {
      userMessage = "The file could not be read. Please ensure it's a valid Excel file (.xlsx, .xls) or CSV file.";
    } else if (error.message.includes('Gemini') || error.message.includes('AI')) {
      userMessage = "Analysis service is temporarily unavailable. Please try again later.";
    }

    return res.status(500).json({
      ok: false,
      error: userMessage,
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;