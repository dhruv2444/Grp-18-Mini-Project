const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is required in .env file");
}

// ✅ CORRECT MODEL NAMES for latest Gemini API
// Try these models in order of preference:
const AVAILABLE_MODELS = [
  "gemini-2.0-flash-exp", // Latest experimental
  "gemini-1.5-flash",     // Fast and capable
  "gemini-1.5-pro",       // High quality
  "gemini-1.0-pro"        // Basic but reliable
];

async function analyzeWithGemini(aggregatedData) {
  let lastError = null;
  
  // Try each model until one works
  for (const MODEL of AVAILABLE_MODELS) {
    const GEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    try {
      console.log(`🔄 Trying model: ${MODEL}`);
      const result = await makeGeminiRequest(GEN_URL, aggregatedData, MODEL);
      console.log(`✅ Success with model: ${MODEL}`);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`❌ Model ${MODEL} failed:`, error.message);
      continue; // Try next model
    }
  }
  
  // If all models fail, use fallback
  console.error("❌ All Gemini models failed, using fallback analysis");
  return getFallbackAnalysis(aggregatedData);
}

async function makeGeminiRequest(url, aggregatedData, modelName) {
  // Enhanced data formatting
  const analysisData = {
    overview: {
      totalActivities: aggregatedData.summary?.totalRecords || 0,
      totalScreenTime: aggregatedData.summary?.totalDuration || 0,
      uniqueApps: aggregatedData.summary?.uniqueAppCount || 0,
      averageSession: aggregatedData.summary?.averageSessionDuration ? 
        Math.round(aggregatedData.summary.averageSessionDuration) : 0
    },
    topApps: aggregatedData.topApps?.slice(0, 5) || [],
    categories: aggregatedData.categories || [],
    timeDistribution: aggregatedData.timeDistribution || {}
  };

  const promptText = `
You are a professional productivity coach analyzing mobile activity data. Return ONLY valid JSON with this exact structure:

{
  "summary": "Brief overall summary of activity patterns in 1-2 sentences",
  "metrics": {
    "totalMinutes": 120,
    "productivePercent": 40,
    "entertainmentPercent": 35,
    "socialPercent": 25,
    "mostUsedApp": "App Name"
  },
  "top_time_wasters": [
    {
      "activity": "Social Media",
      "minutes": 60,
      "why": "Excessive scrolling during work hours"
    }
  ],
  "recommended_routine": [
    {
      "time": "Morning (7-9 AM)",
      "activity": "Focused deep work",
      "reason": "Peak mental performance hours"
    }
  ],
  "actions_to_cut": [
    {
      "action": "Limit social media to 30 mins/day",
      "estimated_productive_gain": "2 hours daily"
    }
  ]
}

ANALYZE THIS MOBILE ACTIVITY DATA:

OVERVIEW:
- Total activities: ${analysisData.overview.totalActivities}
- Total screen time: ${analysisData.overview.totalScreenTime} minutes
- Unique apps used: ${analysisData.overview.uniqueApps}
- Average session: ${analysisData.overview.averageSession} minutes

TOP 5 APPS:
${analysisData.topApps.map(app => `- ${app.app}: ${app.sessions} sessions (${app.percentage}%)`).join('\n')}

CATEGORY BREAKDOWN:
${analysisData.categories.map(cat => `- ${cat.category}: ${cat.sessions} sessions (${cat.percentage}%)`).join('\n')}

TIME DISTRIBUTION:
${Object.entries(analysisData.timeDistribution).map(([time, count]) => `- ${time}: ${count} sessions`).join('\n')}

Based on this data, provide personalized insights and recommendations.

Return ONLY the JSON object, no additional text, no markdown formatting.
`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1500,
      topP: 0.8,
      topK: 40
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    console.log("📡 Calling Gemini API...");
    console.log(`📊 Sending data: ${analysisData.overview.totalActivities} activities, ${analysisData.overview.totalScreenTime} minutes`);
    
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000  // 30 second timeout
    });

    console.log("✅ Gemini API call successful");

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response text from Gemini API");
    }

    console.log("📄 Raw Gemini response preview:", responseText.substring(0, 150) + "...");

    // Clean the response text
    let cleanText = responseText.trim();
    
    // Remove any markdown code blocks
    cleanText = cleanText.replace(/```json|```/g, '').trim();
    
    // Extract JSON if it's wrapped in other text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    try {
      const parsedData = JSON.parse(cleanText);
      console.log("✅ Successfully parsed Gemini JSON response");
      
      // Validate the response has required structure
      if (!parsedData.summary || !parsedData.metrics) {
        console.warn("⚠️ Gemini response missing required fields");
        // Still return it but mark as partial
        parsedData._partial = true;
      }
      
      return parsedData;
      
    } catch (parseError) {
      console.error("❌ JSON parsing failed:", parseError.message);
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const errorMsg = error.response.data?.error?.message || "Unknown API error";
      
      if (status === 404) {
        throw new Error(`Model not found: ${modelName}`);
      } else if (status === 429) {
        throw new Error("Rate limit exceeded");
      } else if (status === 403) {
        throw new Error("API key invalid or permissions issue");
      } else {
        throw new Error(`API error (${status}): ${errorMsg}`);
      }
    } else if (error.request) {
      throw new Error("Network error - no response received");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

// Enhanced fallback analysis
function getFallbackAnalysis(aggregatedData) {
  console.log("🔄 Using enhanced fallback analysis");
  
  const analysisData = {
    overview: {
      totalActivities: aggregatedData.summary?.totalRecords || 0,
      totalScreenTime: aggregatedData.summary?.totalDuration || 0,
      uniqueApps: aggregatedData.summary?.uniqueAppCount || 0,
      averageSession: aggregatedData.summary?.averageSessionDuration ? 
        Math.round(aggregatedData.summary.averageSessionDuration) : 0
    },
    topApps: aggregatedData.topApps?.slice(0, 5) || [],
    categories: aggregatedData.categories || []
  };

  const totalMinutes = analysisData.overview.totalScreenTime;
  const totalActivities = analysisData.overview.totalActivities;
  const topApp = analysisData.topApps[0]?.app || "Unknown";
  
  // Calculate percentages based on categories
  let productivePercent = 0;
  let entertainmentPercent = 0; 
  let socialPercent = 0;

  analysisData.categories.forEach(cat => {
    const percentage = parseFloat(cat.percentage) || 0;
    if (cat.category.includes('Social') || cat.category.includes('Messaging')) {
      socialPercent += percentage;
    } else if (cat.category.includes('Entertainment') || cat.category.includes('Game') || cat.category.includes('Video')) {
      entertainmentPercent += percentage;
    } else if (cat.category.includes('Email') || cat.category.includes('Browser') || cat.category.includes('Productive')) {
      productivePercent += percentage;
    }
  });

  // If no categories detected, use default distribution
  const totalCatPercent = productivePercent + entertainmentPercent + socialPercent;
  if (totalCatPercent === 0) {
    productivePercent = 30;
    entertainmentPercent = 45;
    socialPercent = 25;
  } else {
    // Normalize to 100%
    productivePercent = Math.round((productivePercent / totalCatPercent) * 100);
    entertainmentPercent = Math.round((entertainmentPercent / totalCatPercent) * 100);
    socialPercent = 100 - productivePercent - entertainmentPercent;
  }

  return {
    summary: `Analyzed ${totalActivities} mobile activities totaling ${totalMinutes} minutes across ${analysisData.overview.uniqueApps} apps. ${entertainmentPercent > 50 ? 'High entertainment usage detected.' : 'Balanced app usage patterns.'}`,
    metrics: {
      totalMinutes: totalMinutes,
      productivePercent: productivePercent,
      entertainmentPercent: entertainmentPercent,
      socialPercent: socialPercent,
      mostUsedApp: topApp
    },
    top_time_wasters: [
      {
        activity: topApp,
        minutes: Math.round(totalMinutes * (entertainmentPercent / 100)),
        why: "Primary time consumption from entertainment applications"
      }
    ],
    recommended_routine: [
      {
        time: "Morning (8-11 AM)",
        activity: "Focused work blocks",
        reason: "Capitalize on morning mental clarity and focus"
      },
      {
        time: "Evening (7-9 PM)",
        activity: "Digital detox time",
        reason: "Reduce blue light exposure before sleep"
      }
    ],
    actions_to_cut: [
      {
        action: "Set daily usage limits for entertainment apps",
        estimated_productive_gain: `${Math.round(totalMinutes * 0.2)} minutes daily`
      },
      {
        action: "Schedule specific break times for social media",
        estimated_productive_gain: "Improved focus and productivity"
      }
    ],
    note: "AI analysis service unavailable - using enhanced local analysis"
  };
}

module.exports = { analyzeWithGemini };