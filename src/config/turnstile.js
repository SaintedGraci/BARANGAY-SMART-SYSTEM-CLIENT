// Turnstile Configuration
// Priority: Environment Variable > Hardcoded Production Key > Test Key

const getTurnstileSiteKey = () => {
  // 1. Try environment variable first (best practice)
  const envKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  
  if (envKey && envKey !== 'PLACEHOLDER_USE_VERCEL_ENV_VARS' && envKey.length > 10) {
    if (import.meta.env.DEV) {
      console.log('✅ Using Turnstile key from environment');
    }
    return envKey;
  }
  
  // 2. Fallback to hardcoded production key
  // IMPORTANT: Replace this with your actual production site key
  const PRODUCTION_SITE_KEY = 'YOUR_PRODUCTION_TURNSTILE_SITE_KEY_HERE';
  
  if (PRODUCTION_SITE_KEY !== 'YOUR_PRODUCTION_TURNSTILE_SITE_KEY_HERE') {
    if (import.meta.env.DEV) {
      console.log('✅ Using hardcoded production Turnstile key');
    }
    return PRODUCTION_SITE_KEY;
  }
  
  // 3. Fallback to test key for development
  if (import.meta.env.DEV) {
    console.log('⚠️  Using test Turnstile key');
  }
  return '1x00000000000000000000AA';
};

export const TURNSTILE_SITE_KEY = getTurnstileSiteKey();
export const isTurnstileAvailable = TURNSTILE_SITE_KEY && TURNSTILE_SITE_KEY.length > 10;