import type { Metadata } from 'next';
import { Camera } from 'lucide-react';
import { Button } from '@wilkins/ui';

export const metadata: Metadata = { title: 'Camera Translation' };

export default function CameraTranslatePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-text">Camera Translation</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Point your camera at any sign, menu, or notice
        </p>
      </div>

      {/* Camera viewfinder */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-brand-slate">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Camera className="h-16 w-16 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center px-8">
            Camera feed activates when you tap Capture. <br/>
            OCR + translation powered by Wilkins AI.
          </p>
        </div>
        {/* Corner guides */}
        <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-brand-gold rounded-tl-lg" />
        <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-brand-gold rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-brand-gold rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-brand-gold rounded-br-lg" />
      </div>

      <Button size="xl" className="mt-6 w-full gap-2">
        <Camera className="h-5 w-5" />
        Capture & Translate
      </Button>

      <p className="mt-3 text-center text-xs text-brand-muted">
        Works on signs, menus, maps, printed notices, and instructions
      </p>
    </div>
  );
}
