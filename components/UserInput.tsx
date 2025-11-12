import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { ImageFile } from '../types';
import { UploadIcon, SparklesIcon, FileIcon, TrashIcon } from './icons';

interface UserInputProps {
  onGenerate: (prompt: string, image?: ImageFile) => void;
  onQuickGenerate: (prompt: string, image?: ImageFile) => void;
  isLoading: boolean;
}

const fileToImageFile = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const UserInput: React.FC<UserInputProps> = ({ onGenerate, onQuickGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<ImageFile | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageFileData = await fileToImageFile(file);
        setImageFile(imageFileData);
        setPreviewUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  }, []);
  
  const handleRemoveImage = useCallback(() => {
    setImageFile(undefined);
    if(previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, imageFile);
    }
  };

  const handleQuickGenerate = () => {
    if (prompt.trim()) {
        onQuickGenerate(prompt, imageFile);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl shadow-sky-900/10 border border-slate-800 space-y-4">
        <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create or modify..."
              className="w-full h-28 p-4 pr-12 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none text-slate-200 placeholder-slate-500"
              disabled={isLoading}
              aria-label="Image prompt"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewUrl ? (
                <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-4 border border-slate-700">
                    <img src={previewUrl} alt="Image preview" className="w-16 h-16 object-cover rounded-md border border-slate-600" />
                    <div className="flex-grow">
                        <p className="text-sm font-medium text-slate-200">Source Image</p>
                        <p className="text-xs text-slate-400">Ready to use as reference</p>
                    </div>
                    <button type="button" onClick={handleRemoveImage} disabled={isLoading} className="p-2 rounded-full bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors duration-200" aria-label="Remove image">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            ) : (
                <label htmlFor="image-upload" className="w-full cursor-pointer bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-lg p-4 text-center transition-colors duration-300 flex items-center justify-center gap-3">
                    <UploadIcon className="w-6 h-6 text-slate-400" />
                    <span className="text-sm text-slate-400">Upload an Image (Optional)</span>
                    <input id="image-upload" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isLoading} />
                </label>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-4">
                <button
                    type="button"
                    onClick={handleQuickGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 text-slate-200 font-semibold rounded-lg shadow-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Quick Generate
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-sky-500"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Start Fusion'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default UserInput;