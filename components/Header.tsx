import React from 'react';
import { InfoIcon } from './icons';

interface HeaderProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, setApiKey }) => {
  return (
    <header className="w-full max-w-5xl mx-auto py-6 md:py-8">
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 shadow-2xl shadow-sky-900/10 border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Gemini Fusion Imager
          </h1>
          <details className="w-full sm:w-auto group">
            <summary className="cursor-pointer list-none flex items-center justify-center sm:justify-start gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors bg-sky-900/20 group-hover:bg-sky-900/40 px-4 py-2 rounded-full border border-sky-800/50">
              <InfoIcon className="w-5 h-5" />
              How it works
            </summary>
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 text-sm text-slate-400 max-w-md w-full space-y-4">
              <ol className="list-decimal list-inside space-y-3">
                <li><strong className="font-medium text-slate-200">First Draft:</strong> An AI artist generates an initial image for immediate feedback.</li>
                <li><strong className="font-medium text-slate-200">Plan:</strong> AI architects create a detailed plan for a more refined version.</li>
                <li><strong className="font-medium text-slate-200">Refined Draft:</strong> The artist drafts a new image based on the comprehensive plan.</li>
                <li><strong className="font-medium text-slate-200">Analysis:</strong> AI critics analyze the refined draft for potential improvements.</li>
                <li><strong className="font-medium text-slate-200">Final Image:</strong> The artist refines the image into a final masterpiece.</li>
              </ol>
              <div className="border-t border-slate-700/50 pt-4">
                <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-300 mb-2">Your API Key</label>
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API Key"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 text-slate-200 placeholder-slate-500"
                />
                <p className="text-xs text-slate-500 mt-2">If left blank, the key from the environment will be used automatically.</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
};

export default Header;