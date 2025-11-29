
import React from 'react';
import { Stamp, Ban } from 'lucide-react';
import { WatermarkType } from '../utils/imageProcessor';
import { ASSETS } from '../utils/assets';

interface WatermarkSelectorProps {
  value: WatermarkType;
  onChange: (value: WatermarkType) => void;
  disabled?: boolean;
}

export const WatermarkSelector: React.FC<WatermarkSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
        <Stamp size={16} /> Watermark
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onChange('none')}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24
            ${value === 'none' 
              ? 'bg-slate-800 border-yellow-500 ring-1 ring-yellow-500/50' 
              : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'}
          `}
        >
          <Ban size={20} className="text-slate-400" />
          <span className="text-xs text-slate-400">None</span>
        </button>

        <button
          onClick={() => onChange('icon')}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24
            ${value === 'icon' 
              ? 'bg-slate-800 border-yellow-500 ring-1 ring-yellow-500/50' 
              : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'}
          `}
        >
          <img src={ASSETS.logoIcon} alt="Icon" className="h-8 w-8 object-contain" />
          <span className="text-xs text-slate-400">Icon Only</span>
        </button>

        <button
          onClick={() => onChange('full')}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24
            ${value === 'full' 
              ? 'bg-slate-800 border-yellow-500 ring-1 ring-yellow-500/50' 
              : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'}
          `}
        >
          <img src={ASSETS.logoFull} alt="Full" className="h-6 w-full object-contain px-1" />
          <span className="text-xs text-slate-400">Full Logo</span>
        </button>
      </div>
    </div>
  );
};
