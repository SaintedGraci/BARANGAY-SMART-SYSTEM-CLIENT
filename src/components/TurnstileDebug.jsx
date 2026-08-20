import { useEffect } from 'react';

export const TurnstileDebug = () => {
  useEffect(() => {
    // Only run debug logging in development
    if (import.meta.env.DEV) {
      console.log('=== Turnstile Debug Info ===');
      console.log('VITE_TURNSTILE_SITE_KEY:', import.meta.env.VITE_TURNSTILE_SITE_KEY);
      console.log('Environment Mode:', import.meta.env.MODE);
      console.log('Production Build:', import.meta.env.PROD);
      console.log('All env vars:', import.meta.env);
      
      // Check if the site key looks valid
      const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
      if (!siteKey) {
        console.error('❌ TURNSTILE SITE KEY IS MISSING');
      } else if (siteKey.includes('PLACEHOLDER')) {
        console.error('❌ TURNSTILE SITE KEY IS STILL PLACEHOLDER');
      } else if (siteKey.startsWith('0x')) {
        console.log('✅ Using production Turnstile key');
      } else if (siteKey.startsWith('1x')) {
        console.log('⚠️  Using test Turnstile key');
      } else {
        console.log('🤔 Unknown Turnstile key format:', siteKey.substring(0, 10) + '...');
      }
    }
  }, []);

  return null; // This component doesn't render anything
};