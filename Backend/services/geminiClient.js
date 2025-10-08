const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is required in .env file");
}

// ✅ CORRECT MODEL NAMES for latest Gemini API
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

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const promptText = `
You are an expert productivity coach and addiction control specialist analyzing user activity data.

ACTIVITY DATA:
- Total Screen Time: ${analysisData.overview.totalScreenTime} minutes
- Total Activities: ${analysisData.overview.totalActivities}
- Unique Apps Used: ${analysisData.overview.uniqueApps}
- Average Session: ${analysisData.overview.averageSession} minutes

TOP APPS: ${analysisData.topApps.map(app => `${app.app} (${app.totalMinutes} min)`).join(', ')}

CATEGORIES: ${analysisData.categories.map(cat => `${cat.category}: ${cat.percentage}%`).join(', ')}

Generate an optimized COMPLETE 24-HOUR schedule for tomorrow (${tomorrowStr}) with productivity insights.

Return ONLY valid JSON in this EXACT structure:

{
  "nextDaySchedule": [
    {
      "time": "05:30 AM",
      "duration": "30 min",
      "activity": "Wake up & Morning routine",
      "category": "wellness",
      "priority": "high",
      "tips": "Drink water, light stretching, make bed"
    },
    {
      "time": "06:00 AM",
      "duration": "30 min",
      "activity": "Exercise & Meditation",
      "category": "wellness",
      "priority": "high",
      "tips": "20 min cardio + 10 min meditation"
    },
    {
      "time": "06:30 AM",
      "duration": "30 min",
      "activity": "Shower & Get ready",
      "category": "wellness",
      "priority": "medium",
      "tips": "Prepare for productive day ahead"
    },
    {
      "time": "07:00 AM",
      "duration": "30 min",
      "activity": "Healthy breakfast",
      "category": "meals",
      "priority": "high",
      "tips": "Protein-rich meal, avoid heavy carbs"
    },
    {
      "time": "07:30 AM",
      "duration": "30 min",
      "activity": "Daily planning & priorities",
      "category": "work",
      "priority": "critical",
      "tips": "Review top 3 tasks, check calendar"
    },
    {
      "time": "08:00 AM",
      "duration": "90 min",
      "activity": "Deep work session 1 - Most important task",
      "category": "work",
      "priority": "critical",
      "tips": "No distractions, phone on DND mode"
    },
    {
      "time": "09:30 AM",
      "duration": "15 min",
      "activity": "Break & stretch",
      "category": "breaks",
      "priority": "medium",
      "tips": "Walk around, hydrate, eye rest"
    },
    {
      "time": "09:45 AM",
      "duration": "90 min",
      "activity": "Deep work session 2 - Priority task",
      "category": "work",
      "priority": "high",
      "tips": "Maintain focus, use Pomodoro if needed"
    },
    {
      "time": "11:15 AM",
      "duration": "15 min",
      "activity": "Quick break",
      "category": "breaks",
      "priority": "medium",
      "tips": "Stretch, hydrate, brief walk"
    },
    {
      "time": "11:30 AM",
      "duration": "60 min",
      "activity": "Email & communication time",
      "category": "work",
      "priority": "medium",
      "tips": "Batch process emails, return calls"
    },
    {
      "time": "12:30 PM",
      "duration": "60 min",
      "activity": "Lunch break",
      "category": "meals",
      "priority": "high",
      "tips": "Eat mindfully, step outside if possible"
    },
    {
      "time": "01:30 PM",
      "duration": "90 min",
      "activity": "Focused work - Secondary tasks",
      "category": "work",
      "priority": "high",
      "tips": "Tackle medium priority items"
    },
    {
      "time": "03:00 PM",
      "duration": "15 min",
      "activity": "Afternoon break",
      "category": "breaks",
      "priority": "medium",
      "tips": "Coffee/tea break, brief movement"
    },
    {
      "time": "03:15 PM",
      "duration": "90 min",
      "activity": "Meetings & collaboration",
      "category": "work",
      "priority": "medium",
      "tips": "Active participation, take notes"
    },
    {
      "time": "04:45 PM",
      "duration": "15 min",
      "activity": "Short break",
      "category": "breaks",
      "priority": "low",
      "tips": "Quick refresh before final session"
    },
    {
      "time": "05:00 PM",
      "duration": "60 min",
      "activity": "Admin tasks & planning tomorrow",
      "category": "work",
      "priority": "medium",
      "tips": "Clear inbox, prep for next day"
    },
    {
      "time": "06:00 PM",
      "duration": "30 min",
      "activity": "Commute / Transition time",
      "category": "breaks",
      "priority": "low",
      "tips": "Listen to podcast or music"
    },
    {
      "time": "06:30 PM",
      "duration": "45 min",
      "activity": "Exercise / Sports / Gym",
      "category": "exercise",
      "priority": "high",
      "tips": "Strength training or cardio"
    },
    {
      "time": "07:15 PM",
      "duration": "45 min",
      "activity": "Dinner preparation & eating",
      "category": "meals",
      "priority": "high",
      "tips": "Healthy meal, eat slowly"
    },
    {
      "time": "08:00 PM",
      "duration": "60 min",
      "activity": "Personal time / Hobbies",
      "category": "social",
      "priority": "medium",
      "tips": "Reading, hobby, quality time"
    },
    {
      "time": "09:00 PM",
      "duration": "30 min",
      "activity": "Learning / Skill development",
      "category": "learning",
      "priority": "medium",
      "tips": "Online course, reading, practice"
    },
    {
      "time": "09:30 PM",
      "duration": "30 min",
      "activity": "Wind down routine",
      "category": "wellness",
      "priority": "high",
      "tips": "No screens, light reading, journal"
    },
    {
      "time": "10:00 PM",
      "duration": "30 min",
      "activity": "Prepare for bed",
      "category": "wellness",
      "priority": "high",
      "tips": "Brush, skincare, set alarm"
    },
    {
      "time": "10:30 PM",
      "duration": "450 min",
      "activity": "Sleep",
      "category": "sleep",
      "priority": "critical",
      "tips": "7.5 hours minimum, dark room"
    }
  ],
  "productivityScore": 75,
  "timeWastingAnalysis": [
    {
      "issue": "Excessive social media usage during work hours",
      "timeWasted": "2.5 hours/day",
      "impact": "Reduces deep work capacity by 40%",
      "solution": "Use app blockers (Freedom, Cold Turkey) during 9AM-12PM and 2PM-5PM. Schedule 2x 15-min social media breaks.",
      "priority": "critical"
    },
    {
      "issue": "Unstructured evening routine",
      "timeWasted": "1.5 hours/day",
      "impact": "Poor sleep quality and morning fatigue",
      "solution": "Set fixed 9PM wind-down time. No screens after 10PM. Prepare tomorrow's tasks before bed.",
      "priority": "high"
    },
    {
      "issue": "Multitasking during important tasks",
      "timeWasted": "1 hour/day",
      "impact": "30% drop in work quality",
      "solution": "Implement Pomodoro technique (25 min focus + 5 min break). Close all unnecessary tabs and apps.",
      "priority": "high"
    },
    {
      "issue": "Skipping breaks leading to burnout",
      "timeWasted": "45 min/day in reduced efficiency",
      "impact": "Afternoon productivity drops significantly",
      "solution": "Schedule mandatory 5-min breaks every hour. Take a 15-min walk after lunch.",
      "priority": "medium"
    },
    {
      "issue": "Poor task prioritization",
      "timeWasted": "30 min/day",
      "impact": "Important tasks delayed",
      "solution": "Use Eisenhower Matrix each morning. Tackle most important task first (eat the frog).",
      "priority": "medium"
    }
  ],
  "addictionControl": {
    "identifiedAddictions": ["social media", "gaming", "phone checking"],
    "strategies": [
      "Enable grayscale mode on phone to reduce dopamine triggers",
      "Use website blockers during deep work sessions",
      "Replace scrolling habit with 5-min stretching or water break",
      "Set phone to Do Not Disturb mode from 9AM-12PM and 2PM-5PM"
    ],
    "dailyLimits": {
      "socialMedia": "30 minutes total",
      "gaming": "1 hour after 8PM only",
      "phoneChecks": "Once per hour maximum"
    }
  },
  "keyRecommendations": [
    "Start day with highest-priority task (deep work)",
    "Batch similar tasks together (emails, calls, admin)",
    "Take regular breaks to maintain peak performance",
    "End day by reviewing accomplishments and planning tomorrow"
  ]
}

CRITICAL REQUIREMENTS:
- Provide COMPLETE 24-hour schedule from 5:30 AM to 10:30 PM + sleep
- Include ALL time blocks: work, meals, breaks, exercise, personal time, sleep
- Each entry must have: time, duration, activity, category, priority, tips
- Total schedule should account for full 24 hours
- Categories: work, wellness, learning, social, breaks, meals, exercise, sleep
- Priority levels: critical, high, medium, low
- Make schedule realistic and sustainable
- Balance productivity with rest and personal time
- Address identified time-wasting patterns in the analysis
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
      temperature: 0.3,
      maxOutputTokens: 2500,
      topP: 0.85,
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
    analysisData.overview.totalScreenTime =500
    
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
      if (!parsedData.nextDaySchedule || !Array.isArray(parsedData.nextDaySchedule)) {
        console.warn("⚠️ Gemini response missing schedule");
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

// Enhanced fallback analysis with full day schedule
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

  return {
    nextDaySchedule: [
      { time: "05:30 AM", duration: "30 min", activity: "Wake up & Morning routine", category: "wellness", priority: "high", tips: "Start fresh, hydrate" },
      { time: "06:00 AM", duration: "30 min", activity: "Exercise", category: "exercise", priority: "high", tips: "Cardio or yoga" },
      { time: "06:30 AM", duration: "30 min", activity: "Shower & Get ready", category: "wellness", priority: "medium", tips: "Prepare for day" },
      { time: "07:00 AM", duration: "30 min", activity: "Breakfast", category: "meals", priority: "high", tips: "Healthy meal" },
      { time: "07:30 AM", duration: "30 min", activity: "Daily planning", category: "work", priority: "critical", tips: "Set top 3 priorities" },
      { time: "08:00 AM", duration: "90 min", activity: "Deep work - Most important task", category: "work", priority: "critical", tips: "No distractions" },
      { time: "09:30 AM", duration: "15 min", activity: "Break", category: "breaks", priority: "medium", tips: "Stretch and hydrate" },
      { time: "09:45 AM", duration: "90 min", activity: "Deep work - Priority task", category: "work", priority: "high", tips: "Stay focused" },
      { time: "11:15 AM", duration: "15 min", activity: "Break", category: "breaks", priority: "medium", tips: "Quick walk" },
      { time: "11:30 AM", duration: "60 min", activity: "Email & communication", category: "work", priority: "medium", tips: "Batch emails" },
      { time: "12:30 PM", duration: "60 min", activity: "Lunch", category: "meals", priority: "high", tips: "Eat mindfully" },
      { time: "01:30 PM", duration: "90 min", activity: "Work session", category: "work", priority: "high", tips: "Secondary tasks" },
      { time: "03:00 PM", duration: "15 min", activity: "Break", category: "breaks", priority: "medium", tips: "Coffee break" },
      { time: "03:15 PM", duration: "90 min", activity: "Meetings", category: "work", priority: "medium", tips: "Active listening" },
      { time: "04:45 PM", duration: "15 min", activity: "Break", category: "breaks", priority: "low", tips: "Refresh" },
      { time: "05:00 PM", duration: "60 min", activity: "Admin & planning", category: "work", priority: "medium", tips: "Wrap up day" },
      { time: "06:00 PM", duration: "30 min", activity: "Commute", category: "breaks", priority: "low", tips: "Decompress" },
      { time: "06:30 PM", duration: "45 min", activity: "Exercise", category: "exercise", priority: "high", tips: "Evening workout" },
      { time: "07:15 PM", duration: "45 min", activity: "Dinner", category: "meals", priority: "high", tips: "Healthy meal" },
      { time: "08:00 PM", duration: "60 min", activity: "Personal time", category: "social", priority: "medium", tips: "Relax and unwind" },
      { time: "09:00 PM", duration: "30 min", activity: "Learning", category: "learning", priority: "medium", tips: "Read or study" },
      { time: "09:30 PM", duration: "30 min", activity: "Wind down", category: "wellness", priority: "high", tips: "No screens" },
      { time: "10:00 PM", duration: "30 min", activity: "Prepare for bed", category: "wellness", priority: "high", tips: "Evening routine" },
      { time: "10:30 PM", duration: "450 min", activity: "Sleep", category: "sleep", priority: "critical", tips: "7.5 hours rest" }
    ],
    productivityScore: 70,
    timeWastingAnalysis: [
      {
        issue: "Excessive app usage",
        timeWasted: "2 hours/day",
        impact: "Reduced focus time",
        solution: "Use app blockers during work hours",
        priority: "high"
      }
    ],
    addictionControl: {
      identifiedAddictions: ["social media", "phone checking"],
      strategies: ["Enable Do Not Disturb mode", "Set daily app limits"],
      dailyLimits: { socialMedia: "30 minutes", phoneChecks: "Once per hour" }
    },
    keyRecommendations: [
      "Start with most important task",
      "Take regular breaks",
      "Maintain consistent sleep schedule"
    ]
  };
}

module.exports = { analyzeWithGemini };