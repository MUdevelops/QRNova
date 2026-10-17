import { useState } from 'react';
import Logo from './Logo';
import LegalDialog, { PrivacyContent, TermsContent } from './LegalDialog';
import { CONTACT_EMAIL } from '../lib/config';

const link = 'rounded text-sm text-ink-soft transition-colors hover:text-nova-700';

export default function Footer() {
  const [dialog, setDialog] = useState<'privacy' | 'terms' | null>(null);
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-soft">Create. Scan. Connect.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            <li><a className={link} href="#home">Home</a></li>
            <li><a className={link} href="#features">Features</a></li>
            <li><a className={link} href="#faq">FAQ</a></li>
          </ul>
        </nav>
        <ul className="space-y-3">
          <li><button type="button" className={link} onClick={() => setDialog('privacy')}>Privacy Policy</button></li>
          <li><button type="button" className={link} onClick={() => setDialog('terms')}>Terms of Service</button></li>
          <li>
            {CONTACT_EMAIL
              ? <a className={link} href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
              : <span className="text-sm text-ink-muted">Contact: not configured yet</span>}
          </li>
        </ul>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink-muted">© {new Date().getFullYear()} QRNova. All rights reserved.</div>

      <LegalDialog open={dialog === 'privacy'} title="Privacy Policy" onClose={() => setDialog(null)}><PrivacyContent /></LegalDialog>
      <LegalDialog open={dialog === 'terms'} title="Terms of Service" onClose={() => setDialog(null)}><TermsContent /></LegalDialog>
    </footer>
  );
}
