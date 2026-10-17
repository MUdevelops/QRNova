export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-icon.png" alt="" width={36} height={36} className="h-9 w-9 mix-blend-multiply" />
      <span className="text-xl font-extrabold tracking-tight text-ink">
        QR<span className="bg-gradient-to-r from-nova-500 to-sky-500 bg-clip-text text-transparent">Nova</span>
      </span>
    </span>
  );
}
