import { useEffect } from 'react';
import { PinProps } from '@/types';

export interface createPinIframeProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  pins: PinProps[];
  onPinAttempt: (xPercent: number, yPercent: number, iframeUrl: string, iframeClientX: number, iframeClientY: number) => void;
  iframeUrl: string;
  siteComentar: boolean;
}

export function createPinIframe({
  iframeRef,
  pins,
  onPinAttempt,
  iframeUrl,
  siteComentar
}: createPinIframeProps) {
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let iframeDoc: Document;
    let body: HTMLElement;

    const onClick = async (e: MouseEvent) => {

      const statusSite = siteComentar
      if (statusSite == false) return
      const rect = body.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      onPinAttempt(x, y, iframeUrl, e.clientX, e.clientY);
    };

    const renderPinsInIframe = () => {
      if (!iframeDoc || !body) return;

      const existing = iframeDoc.querySelectorAll('.pin-custom');
      existing.forEach(el => el.remove());

      pins.forEach(pin => {
        const el = iframeDoc.createElement('div');
        el.className = 'pin-custom';
        el.innerText = `${pin.num || ''}`;
        el.setAttribute('data-feedybacky-id', pin.id);

        Object.assign(el.style, {
          position: 'absolute',
          left: `${pin.x}%`,
          top: `${pin.y}%`,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          border: '2px solid white',
          color: 'white',
          fontSize: '13px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translate(-50%, -50%)',
          zIndex: '9999',
        });
        body.appendChild(el);
      });
    };

    const setupIframe = () => {
      iframeDoc = iframe.contentDocument!;
      body = iframeDoc.body;

      body.style.position = 'relative';
      body.style.cursor = 'pointer';

      body.removeEventListener('click', onClick);
      body.addEventListener('click', onClick);

      renderPinsInIframe();
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
    }

    return () => {
      iframe.removeEventListener('load', setupIframe);
      iframe.contentDocument?.body?.removeEventListener('click', onClick);
    };
  }, [iframeRef, pins, onPinAttempt, iframeUrl, siteComentar]);
}
