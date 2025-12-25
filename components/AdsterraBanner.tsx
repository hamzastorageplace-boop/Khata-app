import React, { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  height?: number;
  width?: number;
}

const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ height = 50, width = 320 }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
        // Clear any existing scripts to prevent duplicates
        bannerRef.current.innerHTML = '';

        const zoneId = '8bb77c4d84ed657dab7d370c26e05600'; 
        const scriptUrl = `//www.highperformanceformat.com/${zoneId}/invoke.js`; 

        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = `
            atOptions = {
                'key' : '${zoneId}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
            };
        `;

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = scriptUrl;

        bannerRef.current.appendChild(confScript);
        bannerRef.current.appendChild(invokeScript);
    }
  }, [height, width]);

  return (
    <div className="flex justify-center items-center my-4 overflow-hidden relative z-10 min-h-[50px]">
      <div 
        ref={bannerRef} 
        style={{ width: width, height: height }}
        className="bg-white/5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg backdrop-blur-sm"
      >
      </div>
    </div>
  );
};

export default AdsterraBanner;