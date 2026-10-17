import { AlertTriangle, ImageIcon, Link2, Type } from 'lucide-react';
import QRCanvas from './QRCanvas';
import type { Mode, QRStyle } from '../lib/types';
import { utf8Bytes } from '../lib/validation';

const EMPTY: Record<Mode, { icon: typeof Link2; text: string }> = {
  link: { icon: Link2, text: 'Enter a link and your QR code appears here.' },
  text: { icon: Type, text: 'Type some text and your QR code appears here.' },
  image: { icon: ImageIcon, text: 'Upload an image and create the code to see it here.' },
};

interface Props {
  mode: Mode;
  data: string | null;
  style: QRStyle;
  issue: string | null;
  onError: (m: string | null) => void;
}

export default function QRPreview({ mode, data, style, issue, onError }: Props) {
  const Empty = EMPTY[mode];
  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-2xl border border-line bg-white">
        <QRCanvas data={data} style={style} onError={onError} className="h-full w-full" />
        {!data && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            {issue ? (
              <>
                <AlertTriangle className="text-red-500" size={28} />
                <p className="text-sm text-red-600">{issue}</p>
              </>
            ) : (
              <>
                <Empty.icon className="text-nova-500" size={28} />
                <p className="text-sm text-ink-muted">{Empty.text}</p>
              </>
            )}
          </div>
        )}
      </div>
      <p className="mx-auto mt-3 max-w-[340px] text-center text-xs text-ink-muted">
        {data
          ? mode === 'text'
            ? `Encodes ${utf8Bytes(data)} bytes of text`
            : <span className="line-clamp-2 break-all">Encodes {data}</span>
          : 'Nothing to export yet'}
      </p>
    </div>
  );
}
