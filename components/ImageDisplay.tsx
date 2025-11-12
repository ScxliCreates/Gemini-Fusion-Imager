import React, { useState } from 'react';
import { DownloadIcon, FullscreenIcon, XIcon } from './icons';

interface ImageDisplayProps {
  imageBase64: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageBase64 }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageUrl = `data:image/png;base64,${imageBase64}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-fusion-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="relative group w-full aspect-square bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img src={imageUrl} alt="Generated" className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            className="p-3 bg-slate-800/80 rounded-full text-white hover:bg-sky-600 transition-all transform hover:scale-110"
            title="Download Image"
            aria-label="Download Image"
          >
            <DownloadIcon />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-3 bg-slate-800/80 rounded-full text-white hover:bg-sky-600 transition-all transform hover:scale-110"
            title="View Fullscreen"
            aria-label="View Fullscreen"
          >
            <FullscreenIcon />
          </button>
        </div>
      </div>

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in-fast"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image view"
        >
           <style>{`
            @keyframes fade-in-fast {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
           `}</style>
          <img 
            src={imageUrl} 
            alt="Generated Fullscreen" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
           <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white/100 bg-black/20 hover:bg-black/50 rounded-full transition-colors"
            aria-label="Close fullscreen view"
          >
            <XIcon className="w-8 h-8"/>
          </button>
        </div>
      )}
    </>
  );
};

export default ImageDisplay;