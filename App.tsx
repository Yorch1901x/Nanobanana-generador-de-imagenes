import React, { useState } from 'react';
import { Wand2, Sparkles, Command, Monitor, Smartphone, Square, LayoutTemplate, Lightbulb, ArrowRight, Loader2, MessageSquarePlus } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ImageFile, AppStatus, GeneratedContent, AspectRatio } from './types';
import { generateOrEditImage, generateCreativePrompts } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [contentImage, setContentImage] = useState<ImageFile | null>(null);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Idea Generator State
  const [showIdeaGenerator, setShowIdeaGenerator] = useState(false);
  const [ideaTopic, setIdeaTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      // Collect valid images
      const images = [];
      if (contentImage) images.push({ base64: contentImage.base64, mimeType: contentImage.mimeType });
      if (styleImage) images.push({ base64: styleImage.base64, mimeType: styleImage.mimeType });

      const generatedContent = await generateOrEditImage(
        prompt,
        images,
        aspectRatio
      );
      
      setResult(generatedContent);
      setStatus(AppStatus.SUCCESS);
      
      if (!generatedContent.imageUrl && !generatedContent.text) {
        setError("The model didn't return any content. Please try a different prompt.");
        setStatus(AppStatus.ERROR);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!ideaTopic.trim()) return;
    setIsGeneratingIdeas(true);
    setIdeas([]);
    try {
      const generated = await generateCreativePrompts(ideaTopic);
      setIdeas(generated);
    } catch (e) {
      console.error("Failed to generate ideas", e);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const ratios: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
    { value: '1:1', label: '1:1', icon: <Square size={16} /> },
    { value: '4:3', label: '4:3', icon: <LayoutTemplate size={16} /> },
    { value: '3:4', label: '3:4', icon: <LayoutTemplate size={16} className="rotate-90" /> },
    { value: '16:9', label: '16:9', icon: <Monitor size={16} /> },
    { value: '9:16', label: '9:16', icon: <Smartphone size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-yellow-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-2 rounded-lg">
               <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Nano Banana Studio
            </h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700 hidden sm:block">
            Powered by Gemini 2.5 Flash Image
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Intro Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Create & Edit</h2>
              <p className="text-slate-400 text-sm">
                Describe what you want to see. Attach references for content or style to guide the generation.
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader 
                 label="Structure / Content"
                 selectedImage={contentImage} 
                 onImageSelected={setContentImage}
                 disabled={status === AppStatus.LOADING}
                 compact
               />
               <ImageUploader 
                 label="Style Reference"
                 selectedImage={styleImage} 
                 onImageSelected={setStyleImage}
                 disabled={status === AppStatus.LOADING}
                 compact
               />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Image Size</label>
              <div className="flex flex-wrap gap-2">
                {ratios.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setAspectRatio(r.value)}
                    disabled={status === AppStatus.LOADING}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border
                      ${aspectRatio === r.value 
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 font-medium' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'}
                    `}
                  >
                    {r.icon}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Generator Section */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden">
               <button 
                   onClick={() => setShowIdeaGenerator(!showIdeaGenerator)}
                   className="w-full flex items-center justify-between p-3 px-4 text-left hover:bg-slate-800 transition-colors group"
               >
                   <span className="flex items-center gap-2 font-medium text-slate-200 text-sm">
                       <Lightbulb size={16} className="text-yellow-400 group-hover:text-yellow-300" />
                       AI Prompt Generator
                   </span>
                   <span className="text-xs text-slate-500">{showIdeaGenerator ? 'Close' : 'Expand'}</span>
               </button>
               
               {showIdeaGenerator && (
                   <div className="p-4 border-t border-slate-700/50 space-y-4 bg-slate-900/30">
                        <div className="flex gap-2">
                           <input 
                               type="text" 
                               value={ideaTopic}
                               onChange={(e) => setIdeaTopic(e.target.value)}
                               placeholder="Enter a topic (e.g. 'Cyberpunk Cat')"
                               className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-yellow-500 outline-none"
                               onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdeas()}
                           />
                           <button 
                               onClick={handleGenerateIdeas}
                               disabled={isGeneratingIdeas || !ideaTopic}
                               className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                           >
                              {isGeneratingIdeas ? <Loader2 size={18} className="animate-spin"/> : <MessageSquarePlus size={18}/>}
                           </button>
                        </div>
                        
                        {ideas.length > 0 && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                               {ideas.map((idea, idx) => (
                                   <div 
                                       key={idx} 
                                       onClick={() => setPrompt(idea)}
                                       className="p-3 bg-slate-800/80 rounded-lg text-xs text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white hover:border-yellow-500/50 border border-transparent transition-all group relative"
                                   >
                                       <p className="line-clamp-3 pr-4">{idea}</p>
                                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <ArrowRight size={12} className="text-yellow-400" />
                                       </div>
                                   </div>
                               ))}
                            </div>
                        )}
                   </div>
               )}
            </div>

            {/* Prompt Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Command size={16} /> Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'A futuristic city' or 'Use the style reference to paint the structure image'..."
                  className="w-full h-32 bg-slate-800 border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition-all resize-none text-base"
                  disabled={status === AppStatus.LOADING}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {prompt.length} chars
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === AppStatus.LOADING}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                ${!prompt.trim() || status === AppStatus.LOADING 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-orange-900/20 hover:shadow-orange-900/40 active:scale-[0.98]'}
              `}
            >
              {status === AppStatus.LOADING ? (
                 <>Generating...</>
              ) : (
                 <><Wand2 size={20} /> Generate</>
              )}
            </button>
            
            {/* Examples / Hints */}
            <div className="pt-4 border-t border-slate-800">
               <p className="text-xs text-slate-500 font-medium mb-3">TRY THESE PROMPTS</p>
               <div className="flex flex-wrap gap-2">
                  <button onClick={() => setPrompt("Make it look like a pencil sketch")} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-slate-700">
                    ✎ Pencil sketch
                  </button>
                  <button onClick={() => setPrompt("Transform this into a cyberpunk city")} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-slate-700">
                    🌃 Cyberpunk style
                  </button>
                  <button onClick={() => setPrompt("Oil painting of a cat in space")} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-slate-700">
                    🎨 Oil Painting
                  </button>
               </div>
            </div>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <ResultDisplay status={status} result={result} error={error} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;