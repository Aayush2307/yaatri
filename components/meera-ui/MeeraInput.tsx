'use client';
import { type KeyboardEvent, useRef, type ChangeEvent } from 'react';

interface MeeraInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MeeraInput({ value, onChange, onSubmit, disabled, placeholder }: MeeraInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }

  return (
    <div style={{ padding: '0 0 20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          background: 'rgba(26,20,16,0.82)',
          border: '1px solid var(--meera-border)',
          borderRadius: 3,
          backdropFilter: 'blur(14px)',
          transition: 'border-color 0.3s ease',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={placeholder ?? 'Share what is in your heart…'}
          rows={1}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--meera-text-primary)',
            fontFamily: 'var(--meera-font-display)',
            fontSize: 16,
            fontWeight: 300,
            fontStyle: 'italic',
            padding: '14px 16px',
            resize: 'none',
            lineHeight: 1.5,
            minHeight: 50,
            maxHeight: 120,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--meera-gold)',
            padding: '14px 18px',
            cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
            fontSize: 18,
            opacity: disabled || !value.trim() ? 0.3 : 0.8,
            transition: 'opacity 0.2s',
            flexShrink: 0,
            alignSelf: 'flex-end',
            lineHeight: 1,
          }}
        >
          ↑
        </button>
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--meera-text-dim)',
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: '0.1em',
          fontStyle: 'italic',
          fontFamily: 'var(--meera-font-body)',
        }}
      >
        speak freely · meera listens deeply
      </div>
    </div>
  );
}
