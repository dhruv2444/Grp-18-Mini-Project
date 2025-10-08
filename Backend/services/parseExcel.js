const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const path = require("path");

async function parseExcel(filePathOrBuffer, originalName = "") {
  try {
    console.log("📁 Starting Excel parsing...");
    
    let rows = [];
    let isBuffer = Buffer.isBuffer(filePathOrBuffer);
    let fileExtension = originalName ? path.extname(originalName).toLowerCase() : '';

    // 🟡 CASE 1: Try XLSX first (better for .xls files)
    try {
      console.log("🔄 Trying XLSX parser first...");
      let workbook;
      
      if (isBuffer) {
        workbook = XLSX.read(filePathOrBuffer, { 
          type: 'buffer',
          cellDates: true,
          cellText: true,
          raw: false
        });
      } else {
        workbook = XLSX.readFile(filePathOrBuffer, {
          cellDates: true,
          cellText: true,
          raw: false
        });
      }

      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found");

      const worksheet = workbook.Sheets[sheetName];
      
      // Get all data as array of arrays first to see structure
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: '',
        raw: false 
      });
      
      console.log("📋 Excel structure preview:");
      console.log("Headers:", rawData[0]);
      console.log("First data row:", rawData[1]);

      // Convert to objects with proper headers
      const data = XLSX.utils.sheet_to_json(worksheet, { 
        defval: '',
        raw: false 
      });

      console.log(`📊 XLSX parsed ${data.length} rows`);
      console.log("📋 Available columns:", Object.keys(data[0] || {}).join(', '));

      rows = data.map((obj, index) => {
        // DEBUG: Log the first row to see actual data
        if (index === 0) {
          console.log("🔍 First row data:", JSON.stringify(obj, null, 2));
        }

        // FLEXIBLE FIELD EXTRACTION - Try multiple possible column names
        const startAt = obj.start_time || obj.start || obj.timestamp || obj.time || obj.Date || obj.date;
        const endAt = obj.end_time || obj.end || obj.End || obj['End Time'];
        const durationMinutes = obj.duration_minutes || obj.duration || obj.minutes || obj['Total Usage'] || obj.usage || obj.Time || obj.time;
        const appName = obj.app || obj.application || obj.app_name || obj.title || obj.name || obj.App || obj['App Name'] || 'Unknown';

        // Convert duration to number - handle different formats
        let durationValue = 0;
        if (durationMinutes) {
          if (typeof durationMinutes === 'string') {
            // Try to extract numbers from strings like "2h 30m" or "150 minutes"
            const hourMatch = durationMinutes.match(/(\d+)\s*h/);
            const minMatch = durationMinutes.match(/(\d+)\s*m/);
            const numMatch = durationMinutes.match(/(\d+)/);
            
            if (hourMatch && minMatch) {
              durationValue = parseInt(hourMatch[1]) * 60 + parseInt(minMatch[1]);
            } else if (hourMatch) {
              durationValue = parseInt(hourMatch[1]) * 60;
            } else if (minMatch) {
              durationValue = parseInt(minMatch[1]);
            } else if (numMatch) {
              durationValue = parseInt(numMatch[1]);
              // If it's a large number, it might be in seconds
              if (durationValue > 1000) {
                durationValue = Math.round(durationValue / 60);
              }
            }
          } else {
            durationValue = Number(durationMinutes) || 0;
          }
        }

        return {
          startAt,
          endAt,
          durationMinutes: durationValue,
          appName: String(appName || 'Unknown'),
          rawMeta: obj,
          rowNumber: index + 2
        };
      });

      console.log(`✅ XLSX parsed ${rows.length} rows successfully`);
      
      // Log sample of parsed data
      if (rows.length > 0) {
        console.log("📝 Sample parsed row:", {
          appName: rows[0].appName,
          durationMinutes: rows[0].durationMinutes,
          startAt: rows[0].startAt,
          endAt: rows[0].endAt
        });
      }
      
      return rows;

    } catch (xlsxError) {
      console.warn("❌ XLSX failed:", xlsxError.message);
      throw new Error(`XLSX parsing failed: ${xlsxError.message}`);
    }

  } catch (error) {
    console.error("❌ Final parsing error:", error.message);
    throw new Error(`Failed to parse Excel file: ${error.message}. Please check the file format.`);
  }
}

module.exports = parseExcel;