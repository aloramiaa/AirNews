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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-top">
        <div className="nav-center-group">
          <div className="nav-date">{liveTime}</div>
          <Link href="/" className="nav-brand" onClick={() => setSearchQuery('')}>
            AirNews
          </Link>
        </div>
        {isHome && (
        <div className="nav-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: '0 0.2rem' }} 
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button 
              type="submit" 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }} 
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </form>

            <div className="feed-switcher">
              <div className={`feed-slider ${feedType === 'international' ? 'right' : ''}`} />
              <button 
                className={`feed-btn ${feedType === 'india' ? 'active' : ''}`}
                onClick={() => handleFeedSwitch('india')}
              >
                India
              </button>
              <button 
                className={`feed-btn ${feedType === 'international' ? 'active' : ''}`}
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
