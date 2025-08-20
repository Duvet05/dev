import React, { useEffect, useRef } from 'react';

type TRexGameProps = {
  isActive?: boolean;
  onClose?: () => void;
  /** Carpeta bajo /public donde colocaste el proyecto react-chrome-dino */
  baseUrl?: string;
};

export default function TRexGame({ isActive = false, onClose, baseUrl = '/react-chrome-dino' }: TRexGameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isActive, onClose]);

  // Ocultar overlays que puedan interceptar eventos mientras el juego esté activo
  useEffect(() => {
    if (!isActive) return;

    const selectors = ['#main-content', '.overlay', '.ui-overlay', '.overlays', '[data-overlay]'];
    const saved: Array<{ el: HTMLElement; visibility: string; pointerEvents: string; zIndex: string }> = [];

    selectors.forEach(sel => {
      document.querySelectorAll<HTMLElement>(sel).forEach(el => {
        saved.push({ el, visibility: el.style.visibility || '', pointerEvents: el.style.pointerEvents || '', zIndex: (el.style as any).zIndex || '' });
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      });
    });

    return () => {
      saved.forEach(s => {
        try {
          s.el.style.visibility = s.visibility;
          s.el.style.pointerEvents = s.pointerEvents;
          (s.el.style as any).zIndex = s.zIndex;
        } catch (e) {
          // ignore
        }
      });
    };
  }, [isActive]);

  // Al cargar el iframe, forzar foco en su window/document y simular Space/ArrowUp para arrancar el juego
  const onIframeLoad = () => {
    try {
      const ifr = iframeRef.current;
      if (!ifr) return;
      const win = ifr.contentWindow;
      const doc = ifr.contentDocument || (win && win.document);
      if (win) {
        try { win.focus(); } catch (e) { /* ignore */ }
      }
      // Intenta despachar eventos al documento del iframe (mismo origen si está en /public)
      if (doc) {
        try {
          // Simular Space y ArrowUp (keydown + keyup)
          [' ', 'ArrowUp'].forEach(k => {
            const down = new (doc.defaultView as any).KeyboardEvent('keydown', { key: k, code: k === ' ' ? 'Space' : 'ArrowUp', keyCode: k === ' ' ? 32 : 38, which: k === ' ' ? 32 : 38, bubbles: true });
            const up = new (doc.defaultView as any).KeyboardEvent('keyup', { key: k, code: k === ' ' ? 'Space' : 'ArrowUp', keyCode: k === ' ' ? 32 : 38, which: k === ' ' ? 32 : 38, bubbles: true });
            doc.dispatchEvent(down);
            doc.dispatchEvent(up);
          });
        } catch (e) {
          // fallback: intentar dispatch en contentWindow
          try {
            if (win) {
              (win as any).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true }));
              (win as any).dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true }));
            }
          } catch (err) {
            // ignore
          }
        }
      }
    } catch (err) {
      // ignore
    }
  };

  if (!isActive) return null;

  // Rutas candidatas donde puede estar el demo dentro de la carpeta que pegaste en public
  const demoCandidates = [
    `${baseUrl.replace(/\/$/, '')}/apps/example/index.html`,
    `${baseUrl.replace(/\/$/, '')}/index.html`,
    `${baseUrl.replace(/\/$/, '')}/`,
  ];

  // Usamos la primera; si no carga, el iframe mostrará error 404 en su interior y puedes ajustar la ruta
  const src = demoCandidates[0];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-modal>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => onClose?.()} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 960, height: 520, background: '#000', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#111', borderBottom: '1px solid #222', color: '#ddd', fontFamily: 'monospace' }}>
          <div>T‑Rex Game</div>
          <div>
            <button onClick={() => onClose?.()} style={{ background: 'transparent', border: 'none', color: '#ddd', cursor: 'pointer' }}>Close</button>
          </div>
        </div>

        <div style={{ width: '100%', height: '100%', background: '#000' }}>
          <iframe
            ref={iframeRef}
            title="T-Rex Demo"
            src={src}
            onLoad={onIframeLoad}
            style={{ width: '100%', height: '100%', border: 0, background: '#000' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
