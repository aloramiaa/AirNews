'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Search, ArrowRight, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedType, setFeedType] = useState<'india' | 'international'>('india');
  const [liveTime, setLiveTime] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
    // Sync with URL parameters
    const params = new URLSearchParams(window.location.search);
    const feed = params.get('feed');
    if (feed === 'international') {
      setFeedType('international');
    }
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setLiveTime(now.toLocaleString('en-IN', options) + ' IST');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}&feed=${feedType}`;
    }
  };

  const handleFeedSwitch = (type: 'india' | 'international') => {
    setFeedType(type);
    const params = new URLSearchParams();
    params.set('feed', type);
    window.location.href = `/?${params.toString()}`;
  };

  if (!mounted) return null;

  return (
    <nav className={`sticky top-0 z-[1000] w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-b border-[var(--border-color)] ${scrolled ? 'py-[0.6rem] border-t-2 border-t-[var(--border-heavy)] bg-[var(--bg-primary)] shadow-[var(--shadow-md)]' : 'py-4 border-t-4 border-t-[var(--border-heavy)] bg-[var(--glass-bg)] backdrop-blur-[16px] shadow-[var(--shadow-sm)]'}`}>
      <div className={`flex flex-col items-center max-w-[1400px] mx-auto px-10 gap-6 ${scrolled ? 'gap-0 min-h-auto' : ''} max-md:px-4 max-md:gap-4`}>
        <div className={`flex flex-col items-center text-center ${scrolled ? 'm-0' : ''} max-md:w-full`}>
          <div className={`text-[0.8rem] uppercase tracking-[0.1em] font-semibold text-[var(--text-tertiary)] flex-1 ${scrolled ? 'opacity-0 pointer-events-none -translate-y-2.5 absolute' : ''} max-md:block max-md:mb-1 max-md:text-[0.75rem]`}>{liveTime}</div>
          <Link href="/" className={`font-serif text-[3.5rem] font-extrabold tracking-[-0.04em] text-center bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent transition-transform duration-300 cursor-pointer hover:scale-[1.02] ${scrolled ? 'text-[1.8rem] m-0 max-md:text-[1.5rem]' : ''} max-md:text-[1.8rem] max-md:mb-0 max-[480px]:text-[2rem] max-[360px]:text-[1.8rem]`} onClick={() => setSearchQuery('')}>
            AirNews
          </Link>
        </div>
        {isHome && (
        <div className={`flex items-center justify-center gap-6 w-full ${scrolled ? 'opacity-0 pointer-events-none -translate-y-2.5 absolute' : ''} max-md:justify-center max-md:gap-3 max-[360px]:gap-1.5`}>
          <form onSubmit={handleSearch} className="flex items-center bg-[var(--bg-tertiary)] rounded-[50px] py-2 px-4 border border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.02)] flex-1 max-w-[400px] focus-within:border-[var(--text-secondary)] focus-within:bg-[var(--bg-primary)] focus-within:shadow-[var(--shadow-md)]">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-[var(--text-primary)] py-1 px-2 font-sans text-[0.9rem] w-[180px] transition-[width] duration-300 focus:w-[220px] placeholder:text-[var(--text-tertiary)] max-md:w-[120px] max-md:focus:w-[150px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                className="bg-none border-none text-[var(--text-tertiary)] cursor-pointer flex px-1"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button 
              type="submit" 
              className="bg-none border-none text-[var(--text-secondary)] cursor-pointer flex"
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </form>

            <div className="flex bg-[var(--bg-tertiary)] rounded-[50px] p-1 border border-[var(--border-color)] relative overflow-hidden shrink-0">
              <div className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-[var(--accent-color)] rounded-[50px] transition-transform duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)] z-0 ${feedType === 'international' ? 'translate-x-[100%]' : ''}`} />
              <button 
                className={`bg-transparent border-none py-[0.4rem] px-[1.2rem] font-sans text-[0.85rem] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 z-10 whitespace-nowrap shrink-0 ${feedType === 'india' ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'} max-[360px]:py-[0.35rem] max-[360px]:px-[0.8rem] max-[360px]:text-[0.78rem]`}
                onClick={() => handleFeedSwitch('india')}
              >
                India
              </button>
              <button 
                className={`bg-transparent border-none py-[0.4rem] px-[1.2rem] font-sans text-[0.85rem] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 z-10 whitespace-nowrap shrink-0 ${feedType === 'international' ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'} max-[360px]:py-[0.35rem] max-[360px]:px-[0.8rem] max-[360px]:text-[0.78rem]`}
                onClick={() => handleFeedSwitch('international')}
              >
                World
              </button>
            </div>
        </div>
        )}
      </div>

    </nav>
  );
}
