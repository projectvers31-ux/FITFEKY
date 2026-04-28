/**
 * Vercel Speed Insights Initialization
 * 
 * This script initializes Vercel Speed Insights for the FitFeky website.
 * Speed Insights automatically tracks web vitals and performance metrics.
 * 
 * Note: Data is only tracked in production (when deployed to Vercel).
 * No tracking occurs in local development.
 */

import { injectSpeedInsights } from './speed-insights/speed-insights.mjs';

// Initialize Speed Insights
// The injectSpeedInsights function will automatically:
// - Load the Speed Insights tracking script
// - Track Core Web Vitals (LCP, FID, CLS, etc.)
// - Send performance data to Vercel
injectSpeedInsights({
  // Debug mode is automatically enabled in development
  debug: false,
  
  // Sample rate: 1 = 100% of events tracked
  // You can reduce this to save costs (e.g., 0.5 = 50% of events)
  sampleRate: 1
});
