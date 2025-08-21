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
        // Usar getComputedStyle para obtener zIndex en vez de castear a any
        const computed = window.getComputedStyle(el);
        saved.push({ el, visibility: el.style.visibility || '', pointerEvents: el.style.pointerEvents || '', zIndex: computed.zIndex || '' });
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      });
    });

    return () => {
      saved.forEach(s => {
        try {
          s.el.style.visibility = s.visibility;
          s.el.style.pointerEvents = s.pointerEvents;
          s.el.style.zIndex = s.zIndex;
        } catch {
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
        try { win.focus(); } catch { /* ignore */ }
      }
      // Intenta despachar eventos al documento del iframe (mismo origen si está en /public)
      if (doc) {
        try {
          const view = doc.defaultView;
          // Obtener el constructor KeyboardEvent desde el Window del iframe si está disponible.
          // Evitamos usar `any` y en su lugar usamos `unknown` y cast explícito a `typeof KeyboardEvent`.
          const maybeCtor = view ? (view as unknown as Record<string, unknown>)['KeyboardEvent'] : undefined;
          const KeyboardEventCtor = (maybeCtor as typeof KeyboardEvent) ?? KeyboardEvent;

          // Simular Space y ArrowUp (keydown + keyup)
          [' ', 'ArrowUp'].forEach(k => {
            const init: KeyboardEventInit = { key: k, code: k === ' ' ? 'Space' : 'ArrowUp', bubbles: true };
            const down = new KeyboardEventCtor('keydown', init);
            const up = new KeyboardEventCtor('keyup', init);
            doc.dispatchEvent(down);
            doc.dispatchEvent(up);
          });
        } catch {
          // fallback: intentar dispatch en contentWindow
          try {
            if (win) {
              win.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
              win.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
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
