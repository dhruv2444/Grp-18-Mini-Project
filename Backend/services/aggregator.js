// SIMPLIFIED AGGREGATOR - No MongoDB dependency
function aggregateData(parsedData) {
  console.log(`📊 Aggregating ${parsedData.length} parsed records...`);
  
  const summary = {
    totalRecords: parsedData.length,
    totalDuration: 0,
    apps: {},
    categories: {},
    timeSlots: {},
    uniqueApps: new Set()
  };

  // Process each record
  parsedData.forEach((record, index) => {
    try {
      const duration = record.durationMinutes || 0;
      const appName = record.appName || 'Unknown';
      
      // Sum total duration
      summary.totalDuration += duration;
      
      // Count by app
      summary.apps[appName] = (summary.apps[appName] || 0) + 1;
      summary.uniqueApps.add(appName);
      
      // Categorize apps (simple categorization)
      const category = categorizeApp(appName);
      summary.categories[category] = (summary.categories[category] || 0) + 1;
      
      // Analyze time slots if available
      if (record.startAt) {
        const timeSlot = extractTimeSlot(record.startAt);
        summary.timeSlots[timeSlot] = (summary.timeSlots[timeSlot] || 0) + 1;
      }
      
    } catch (error) {
      console.warn(`⚠️ Error processing record ${index}:`, error.message);
    }
  });

  // Convert Set to count
  summary.uniqueAppCount = summary.uniqueApps.size;
  delete summary.uniqueApps;

  // Calculate percentages and format for Gemini
  const topApps = Object.entries(summary.apps)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([app, count]) => ({
      app,
      sessions: count,
      percentage: ((count / summary.totalRecords) * 100).toFixed(1)
    }));

  const categoryBreakdown = Object.entries(summary.categories)
    .map(([category, count]) => ({
      category,
      sessions: count,
      percentage: ((count / summary.totalRecords) * 100).toFixed(1)
    }));

  console.log("📈 Aggregation completed:", {
    totalRecords: summary.totalRecords,
    totalDuration: summary.totalDuration,
    uniqueApps: summary.uniqueAppCount,
    topApps: topApps.slice(0, 3)
  });

  return {
    summary: {
      totalRecords: summary.totalRecords,
      totalDuration: summary.totalDuration,
      uniqueAppCount: summary.uniqueAppCount,
      averageSessionDuration: summary.totalDuration / summary.totalRecords
    },
    topApps,
    categories: categoryBreakdown,
    timeDistribution: summary.timeSlots,
    rawSample: parsedData.slice(0, 3) // Sample for debugging
  };
}

// Helper function to categorize apps
function categorizeApp(appName) {
  const app = appName.toLowerCase();
  
  if (app.includes('instagram') || app.includes('facebook') || app.includes('twitter') || 
      app.includes('tiktok') || app.includes('snapchat') || app.includes('social')) {
    return 'Social Media';
  } else if (app.includes('whatsapp') || app.includes('message') || app.includes('telegram') || 
             app.includes('messenger') || app.includes('chat')) {
    return 'Messaging';
  } else if (app.includes('youtube') || app.includes('netflix') || app.includes('spotify') || 
             app.includes('music') || app.includes('video') || app.includes('entertainment')) {
    return 'Entertainment';
  } else if (app.includes('chrome') || app.includes('browser') || app.includes('safari') || 
             app.includes('search') || app.includes('google')) {
    return 'Browser';
  } else if (app.includes('gmail') || app.includes('outlook') || app.includes('email') || 
             app.includes('mail')) {
    return 'Email';
  } else if (app.includes('camera') || app.includes('photo') || app.includes('gallery')) {
    return 'Photos';
  } else if (app.includes('game') || app.includes('gaming') || app.includes('play')) {
    return 'Games';
  } else {
    return 'Other';
  }
}

// Helper function to extract time slot
function extractTimeSlot(timeString) {
  if (!timeString) return 'Unknown';
  
  try {
    const date = new Date(timeString);
    if (isNaN(date.getHours())) return 'Invalid Time';
    
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning (5-11)';
    if (hour >= 12 && hour < 17) return 'Afternoon (12-16)';
    if (hour >= 17 && hour < 22) return 'Evening (17-21)';
    return 'Night (22-4)';
  } catch {
    return 'Unknown';
  }
}

module.exports = { aggregateData };