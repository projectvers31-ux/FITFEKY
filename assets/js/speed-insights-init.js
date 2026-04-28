// Vercel Speed Insights initialization for static HTML site
// This file initializes Speed Insights tracking

(function() {
  'use strict';
  
  // Initialize Speed Insights queue before script loads
  if (typeof window !== 'undefined' && !window.si) {
    window.si = function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }
  
  // Configuration
  var SPEED_INSIGHTS_SCRIPT = '/_vercel/speed-insights/script.js';
  
  // Function to inject the Speed Insights script
  function injectScript() {
    if (typeof window === 'undefined' || window.sil) {
      return;
    }
    
    window.sil = true;
    
    var script = document.createElement('script');
    script.src = SPEED_INSIGHTS_SCRIPT;
    script.defer = true;
    script.setAttribute('data-speed-insights', 'true');
    
    // Handle script load events
    script.onload = function() {
      console.log('Speed Insights loaded successfully');
    };
    
    script.onerror = function() {
      console.warn('Speed Insights failed to load');
    };
    
    // Insert script
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
  } else {
    injectScript();
  }
})();
