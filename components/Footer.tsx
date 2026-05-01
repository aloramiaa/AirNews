'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/">AirNews</Link>
          <p>Your trusted source for clear, news.</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <span className="footer-col-heading">Company</span>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/authors">Authors</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/grievance">Grievance</Link>
          </div>
          <div className="footer-column">
            <span className="footer-col-heading">Legal</span>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/code-of-business">Code of Business</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            <Link href="/corrections">Corrections Policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} AirNews. All rights reserved.</p>
      </div>
    </footer>
  );
}
