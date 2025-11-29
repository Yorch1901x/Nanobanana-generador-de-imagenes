import React, { useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  label?: string;
  selectedImage: ImageFile | null;
  onImageSelected: (image: ImageFile | null) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label = "Reference Image", 
  selectedImage, 
  onImageSelected, 
  disabled,
  compact = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64 = result.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  }, [onImageSelected]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(null);
  }, [onImageSelected]);

  const triggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const heightClass = compact ? 'h-32' : 'h-48';

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
        <ImageIcon size={16} /> {label}
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {selectedImage ? (
        <div className={`relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg transition-all hover:border-yellow-500/50 ${heightClass}`}>
          <img 
            src={selectedImage.previewUrl} 
            alt="Reference" 
            className="w-full h-full object-contain bg-slate-900/50"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={handleClear}
              disabled={disabled}
              className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-slate-300 truncate">
            {selectedImage.file.name}
          </div>
        </div>
      ) : (
        <div 
          onClick={triggerUpload}
          className={`
            border-2 border-dashed rounded-xl ${heightClass} flex flex-col items-center justify-center cursor-pointer transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/50' : 'border-slate-600 hover:border-yellow-400 hover:bg-slate-800 bg-slate-800/30 text-slate-400 hover:text-yellow-400'}
          `}
        >
          <div className={`p-2 rounded-full bg-slate-800 mb-2 group-hover:scale-110 transition-transform`}>
            <ImageIcon size={compact ? 20 : 24} />
          </div>
          <p className="font-medium text-sm">{compact ? 'Upload' : 'Upload Image'}</p>
          {!compact && <p className="text-xs text-slate-500 mt-1">JPG, PNG</p>}
        </div>
      )}
    </div>
  );
};