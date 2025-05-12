import { useEffect } from 'react';
import { PinProps } from '@/types'; // Import PinProps

export interface IframePinInteractionProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  pins: PinProps[]; // Use PinProps type for better type safety
  // Callback now includes iframe-relative clientX, clientY
  onPinAttempt: (xPercent: number, yPercent: number, iframeUrl: string, iframeClientX: number, iframeClientY: number) => void; 
  iframeUrl: string; // Current URL of the iframe content
  siteComentar: boolean; // Is comment mode active?
}

export function useIframePinInteraction({
  iframeRef,
  pins,
  onPinAttempt,
  iframeUrl,
  siteComentar
}: IframePinInteractionProps) {
  useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  let iframeDoc: Document;
  let body: HTMLElement;

  const onClick = async (e: MouseEvent) => {
    
    const statusSite= siteComentar
    if (statusSite == false) return
    const rect = body.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Call the new callback prop, passing iframe-relative clientX/Y
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
      el.setAttribute('data-feedybacky-id', pin.id); // Add the data attribute

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
    body.style.cursor = 'crosshair';

    body.removeEventListener('click', onClick);
    body.addEventListener('click', onClick);

    renderPinsInIframe();
  };

  // Se já carregado, configura direto
  if (iframe.contentDocument?.readyState === 'complete') {
    setupIframe();
  } else {
    iframe.addEventListener('load', setupIframe);
  }

  return () => {
    iframe.removeEventListener('load', setupIframe);
    iframe.contentDocument?.body?.removeEventListener('click', onClick);
  };
  // Ensure all dependencies are correctly listed
}, [iframeRef, pins, onPinAttempt, iframeUrl, siteComentar]); 
}
