'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
      className="fixed bottom-8 left-8 z-[9999] bg-[var(--text-primary)] text-[var(--bg-primary)] border-none w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-[var(--shadow-lg)] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 hover:rotate-[15deg] hover:shadow-[var(--shadow-hover)] max-md:bottom-6 max-md:left-6 max-md:w-[48px] max-md:h-[48px] max-[768px]:bottom-6 max-[768px]:left-6 max-[768px]:w-[38px] max-[768px]:h-[38px]"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
