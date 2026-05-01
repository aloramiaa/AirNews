'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0f19] text-[#f8fafc] px-10 pt-12 pb-8 mt-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[1fr_2fr] gap-12 mb-8 max-md:grid-cols-1">
        <div className="border-r border-[rgba(248,250,252,0.2)] pr-8 max-md:border-r-0 max-md:border-b max-md:pr-0 max-md:pb-8">
          <Link href="/" className="font-serif text-[2rem] font-extrabold block mb-2 transition-opacity duration-300 hover:opacity-80">AirNews</Link>
          <p className="text-[0.9rem] text-[rgba(248,250,252,0.7)]">Your trusted source for clear, news.</p>
        </div>

        <div className="grid grid-cols-2 gap-12 max-[480px]:gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[0.95rem] uppercase tracking-[0.05em] mb-2">Company</span>
            <Link href="/about" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">About Us</Link>
            <Link href="/contact" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Contact Us</Link>
            <Link href="/authors" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Authors</Link>
            <Link href="/feedback" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Feedback</Link>
            <Link href="/grievance" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Grievance</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[0.95rem] uppercase tracking-[0.05em] mb-2">Legal</span>
            <Link href="/terms" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Privacy Policy</Link>
            <Link href="/code-of-business" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Code of Business</Link>
            <Link href="/cookie-policy" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Cookie Policy</Link>
            <Link href="/corrections" className="text-[0.9rem] text-[rgba(248,250,252,0.7)] transition-colors duration-300 hover:text-white">Corrections Policy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(248,250,252,0.2)] pt-8 text-center text-[0.85rem] text-[rgba(248,250,252,0.6)] max-w-[1400px] mx-auto">
        <p>&copy; {currentYear} AirNews. All rights reserved.</p>
      </div>
    </footer>
  );
}
