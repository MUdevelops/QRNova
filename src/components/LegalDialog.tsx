import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function LegalDialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="legal-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="w-[min(92vw,42rem)] max-h-[85vh] rounded-2xl border border-line p-0 shadow-pop backdrop:bg-ink/40"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="legal-title" className="text-lg font-semibold text-ink">{title}</h2>
        <button type="button" className="btn-ghost" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
      </div>
      <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-ink-soft">{children}</div>
    </dialog>
  );
}

export function PrivacyContent() {
  return (
    <>
      <p>Last updated: October 2026. This is a plain-language summary of how QRNova handles data. The site owner should review it and adapt it to their situation before relying on it.</p>
      <h3 className="font-semibold text-ink">Links and text</h3>
      <p>QR codes made from links or text are generated in your browser. The content you type is not sent to or stored on our servers.</p>
      <h3 className="font-semibold text-ink">Images</h3>
      <p>If you choose Image to QR, the image you select is uploaded to this site's hosting when you click the upload button, and a public link to it is placed in the QR code. Anyone with that link can view the image. We do not require or collect an account. The image remains stored until the site owner removes it.</p>
      <h3 className="font-semibold text-ink">Center logos</h3>
      <p>A logo you add to the center of a code is processed in your browser only and is not uploaded.</p>
      <h3 className="font-semibold text-ink">Logs and cookies</h3>
      <p>QRNova does not set tracking cookies or run analytics. The hosting provider may keep standard server logs, such as IP address and request time, for security and operations.</p>
      <h3 className="font-semibold text-ink">Contact</h3>
      <p>For privacy questions or to request removal of an uploaded image, use the contact address listed in the footer, if one is provided.</p>
    </>
  );
}

export function TermsContent() {
  return (
    <>
      <p>Last updated: October 2026. By using QRNova you agree to these terms. The site owner should review them and adapt them before relying on them.</p>
      <h3 className="font-semibold text-ink">Use of the service</h3>
      <p>QRNova is provided free of charge. You may use it for personal and commercial purposes. Do not use it to create codes that link to illegal, harmful, deceptive or malicious content, and do not upload images you do not have the right to share.</p>
      <h3 className="font-semibold text-ink">Your content</h3>
      <p>You are responsible for the links, text and images you encode. Uploaded images are publicly accessible by link. We may remove uploaded content that breaks these terms.</p>
      <h3 className="font-semibold text-ink">No guarantee</h3>
      <p>QR codes are static. We cannot guarantee that a code will scan on every device or after printing, or that a linked destination or hosted image will stay online. Test every code before distributing it. The service is provided "as is", without warranties of any kind, and we are not liable for losses arising from its use.</p>
      <h3 className="font-semibold text-ink">Changes</h3>
      <p>We may update the service or these terms at any time.</p>
    </>
  );
}
