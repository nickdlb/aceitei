import { useEffect } from 'react'

export function useIframePinInteraction({
  iframeRef,
  pins,
  handleImageClick,
  iframeUrl,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  pins: { x: number; y: number; num?: number }[]
  handleImageClick: (x: number, y: number, iframeUrl: string) => void
  iframeUrl: string | any
}) {
  useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  let iframeDoc: Document;
  let body: HTMLElement;

  const onClick = async (e: MouseEvent) => {
    const rect = body.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    console.log('🟢 Clique detectado no iframe');
    await handleImageClick(x, y, iframeUrl);
  };

  const renderPinsInIframe = () => {
    if (!iframeDoc || !body) return;

    const existing = iframeDoc.querySelectorAll('.pin-custom');
    existing.forEach(el => el.remove());

    pins.forEach(pin => {
      const el = iframeDoc.createElement('div');
      el.className = 'pin-custom';
      el.innerText = `${pin.num || ''}`;

      Object.assign(el.style, {
        position: 'absolute',
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        border: '2px solid white',
        color: 'white',
        fontSize: '12px',
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
}, [pins, handleImageClick, iframeUrl]);
}
