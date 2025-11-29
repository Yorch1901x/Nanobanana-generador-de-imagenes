import React from 'react';
import { Download, Copy, RefreshCw } from 'lucide-react';
import { GeneratedContent, AppStatus } from '../types';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ResultDisplayProps {
  status: AppStatus;
  result: GeneratedContent | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, result, error }) => {
  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `nano-banana-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const hasContent = result && (result.imageUrl || result.text);

  if (status === AppStatus.IDLE && !hasContent) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center opacity-50">
          <RefreshCw size={32} />
        </div>
        <p className="text-lg">Ready to create</p>
        <p className="text-sm mt-1">Your generated image will appear here</p>
      </div>
    );
  }

  if (status === AppStatus.LOADING) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
        <LoadingSpinner />
        <p className="mt-4 text-slate-300 animate-pulse">Generating your masterpiece...</p>
        <p className="text-xs text-slate-500 mt-2">Powered by Gemini 2.5 Flash Image</p>
      </div>
    );
  }

  if (status === AppStatus.ERROR || error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-red-900/30 text-center p-6">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Something went wrong</h3>
        <p className="text-slate-400 max-w-md">{error || "Failed to generate image. Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Result</h2>
        {result?.imageUrl && (
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <Download size={16} />
            Download
          </button>
        )}
      </div>

      <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
        {result?.imageUrl ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
             {/* Use a simple pattern or dark background to show transparency if any */}
            <img 
              src={result.imageUrl} 
              alt="Generated" 
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
            />
          </div>
        ) : (
          result?.text && (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
               <p>No image generated, but the model replied:</p>
            </div>
          )
        )}
        
        {/* If the model returned text alongside the image (e.g. explanation), show it */}
        {result?.text && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-sm text-slate-300">
                <span className="font-semibold text-yellow-500 mr-2">Model:</span>
                {result.text}
            </div>
        )}
      </div>
    </div>
  );
};
