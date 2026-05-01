import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PAGE_CONTENT: Record<string, { title: string; paragraphs: string[] }> = {
  "about": {
    title: "About Us",
    paragraphs: [
      "Welcome to AirNews. Founded on the principle that information should be clear, accessible, and deeply analytical without being robotic or difficult to understand, we are committed to delivering top-tier journalism to our readers.",
      "Our dedicated team works relentlessly to curate, verify, and publish stories that matter to you. From global events to local happenings in India, we strive to present the facts through an objective and highly readable lens.",
      "At AirNews, we believe that an informed public is the cornerstone of a thriving democracy. Thank you for making us your trusted daily news companion.",
    ],
  },
  "contact": {
    title: "Contact Us",
    paragraphs: [
      "We value your feedback and inquiries. Whether you have a news tip, a business proposal, or simply want to say hello, our doors are always open.",
      "Headquarters:\nAirNews\n11/82, Thirunainarkuricy,\nTamil Nadu - 629204,\nIndia.",
      "Editor: N Udhaya Nidhi",
      "Phone: +91 7904704384",
      "Email: contact@airnews.in",
      "Our support team operates from Monday to Saturday, 9:00 AM to 6:00 PM IST.",
    ],
  },
  "authors": {
    title: "Authors",
    paragraphs: [
      "At AirNews, our stories are driven by a team of passionate journalists, researchers, and editors who are dedicated to uncovering the truth.",
      "We combine traditional investigative journalism with modern editorial technology to bring you rapid, accurate, and human-centric reporting. Each piece undergoes rigorous editorial scrutiny to ensure it meets our high standards of integrity.",
      "If you are a freelance writer or industry expert looking to contribute, please reach out via our Contact Us page.",
    ],
  },
  "feedback": {
    title: "Feedback",
    paragraphs: [
      "Your opinion matters to us. We are constantly striving to improve our platform, our reporting, and our user experience.",
      "If you have suggestions regarding our website design, the types of stories we cover, or the functionality of our mobile app, we want to hear from you. Please contact our support team at +91 7904704384 or write to us directly.",
      "Every piece of feedback is reviewed by our core team to help shape the future of AirNews.",
    ],
  },
  "grievance": {
    title: "Grievance",
    paragraphs: [
      "AirNews is committed to maintaining the highest ethical standards. If you have a grievance regarding any content published on our platform, we have a dedicated mechanism to address it promptly.",
      "Please submit your formal grievance in writing, clearly stating the article URL, the date of publication, and the specific nature of your complaint.",
      "Grievance Officer:\nAirNews\n11/82, Thirunainarkuricy,\nTamil Nadu - 629204\nPhone: +91 7904704384",
      "We aim to acknowledge all grievances within 48 hours and resolve them within 15 working days.",
    ],
  },
  "terms": {
    title: "Terms of Service",
    paragraphs: [
      "By accessing and using AirNews, you accept and agree to be bound by the terms and provision of this agreement. Furthermore, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
      "All content provided on this site is for informational purposes only. AirNews makes no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.",
      "AirNews will not be liable for any errors or omissions in this information nor for the availability of this information. We reserve the right to modify these terms at any time.",
    ],
  },
  "privacy": {
    title: "Privacy Policy",
    paragraphs: [
      "Your privacy is critically important to us. At AirNews, we have a few fundamental principles:",
      "We don't ask you for personal information unless we truly need it. We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.",
      "We only store personal information on our servers when required for the ongoing operation of one of our services. Our privacy policy incorporates these principles, ensuring your data is handled with the utmost care and respect.",
    ],
  },
  "code-of-business": {
    title: "Code of Business",
    paragraphs: [
      "The AirNews Code of Business Ethics outlines our commitment to conducting our affairs with honesty, integrity, and in full compliance with the law.",
      "We hold our employees, contractors, and partners to strict ethical standards. Conflict of interest, bribery, and editorial interference are strictly prohibited.",
      "Our editorial independence is our most valuable asset, and our business practices are designed to protect and nurture that independence at all costs.",
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    paragraphs: [
      "AirNews uses cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
      "A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences over a period of time, so you don't have to keep re-entering them.",
      "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.",
    ],
  },
  "corrections": {
    title: "Corrections Policy",
    paragraphs: [
      "AirNews strives for 100% accuracy in our reporting. However, when mistakes occur, we are committed to correcting them promptly and transparently.",
      "If we have published a factual error, we will update the article and append a clear correction notice at the bottom of the page explaining what was changed and when.",
      "To report an error, please contact our editorial desk immediately via our Contact Us page or call us directly at +91 7904704384.",
    ],
  },
};

const VALID_SLUGS = Object.keys(PAGE_CONTENT);

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = PAGE_CONTENT[slug];

  if (!entry) {
    return {
      title: "AirNews",
    };
  }

  return {
    title: `${entry.title} | AirNews`,
    description: entry.paragraphs[0],
  };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = PAGE_CONTENT[slug];

  if (!entry) {
    notFound();
  }

  return (
    <article className="single-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={18} />
        Back to News
      </Link>

      <h1 className="single-title">
        {entry.title}
      </h1>
      <div className="single-meta">
        <div className="single-meta-item">
          <Clock size={16} />
          <span>Last Updated: April 2026</span>
        </div>
      </div>

      <div className="single-body">
        {entry.paragraphs.map((paragraph) => {
          const parts = paragraph.split("\n");

          if (parts.length === 1) {
            return <p key={paragraph}>{paragraph}</p>;
          }

          return (
            <p key={paragraph}>
              {parts.map((part, index) => (
                <span key={part + index}>
                  {part}
                  {index < parts.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </article>
  );
}
