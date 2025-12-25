import React, { useEffect } from 'react';
import { getCurrentUser } from '../services/storage';

const Popunder: React.FC = () => {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initAd = async () => {
      try {
        // STRICT CHECK: Ensure user is authenticated before doing anything
        const user = await getCurrentUser();
        if (!user) {
            // User is not logged in, do not load the ad
            return;
        }

        // Logic to limit annoyance: Check if we loaded this recently
        const KEY = 'easy_khata_popunder_last_loaded';
        const COOLDOWN_MS = 30 * 1000; // 30 seconds

        const lastLoadedStr = localStorage.getItem(KEY);
        const now = Date.now();

        if (lastLoadedStr) {
          const lastLoaded = parseInt(lastLoadedStr, 10);
          if (now - lastLoaded < COOLDOWN_MS) {
            // Too soon! Skip loading the ad to respect user experience
            console.log("Popunder skipped due to cooldown");
            return;
          }
        }

        // Load the script
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl28202503.effectivegatecpm.com/d4/25/74/d4257492450b96c2394fa4924c11863a.js';
        script.async = true;
        document.body.appendChild(script);

        // Update timestamp
        localStorage.setItem(KEY, now.toString());
      } catch (e) {
        console.error("Ad initialization failed", e);
      }
    };

    initAd();

    return () => {
      // Cleanup script if it was added
      if (script && document.body.contains(script)) {
        try {
            document.body.removeChild(script);
        } catch (e) {
            console.warn("Failed to remove popunder script", e);
        }
      }
    };
  }, []);

  return null; // Component renders nothing visibly
};

export default Popunder;