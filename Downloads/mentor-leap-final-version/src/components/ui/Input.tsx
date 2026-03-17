import React from 'react';

export function Input({ label, className = '', ...props }: any) {
  const inputElement = (
    <input
      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#00e5ff';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
      {...props}
    />
  );

  if (!label) return inputElement;

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1 block mb-1">
        {label}
      </label>
      {inputElement}
    </div>
  );
}

export function Textarea({ label, className = '', ...props }: any) {
  const textareaElement = (
    <textarea
      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        minHeight: '120px'
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#00e5ff';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
      {...props}
    />
  );

  if (!label) return textareaElement;

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1 block mb-1">
        {label}
      </label>
      {textareaElement}
    </div>
  )
}
