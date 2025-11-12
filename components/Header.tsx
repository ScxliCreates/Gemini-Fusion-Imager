import React from 'react';
import { InfoIcon } from './icons';

const Header: React.FC = () => {
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
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 text-sm text-slate-400 max-w-md w-full">
              <ol className="list-decimal list-inside space-y-3">
                <li><strong className="font-medium text-slate-200">Plan:</strong> AI architects create a detailed plan from your prompt.</li>
                <li><strong className="font-medium text-slate-200">Draft:</strong> An AI artist drafts an initial image based on the plan.</li>
                <li><strong className="font-medium text-slate-200">Analysis:</strong> AI critics analyze the draft for potential improvements.</li>
                <li><strong className="font-medium text-slate-200">Refinement:</strong> The AI artist refines the image into a final masterpiece.</li>
              </ol>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
};

export default Header;