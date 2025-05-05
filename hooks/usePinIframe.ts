import { useEffect } from 'react'

export function useIframePinInteraction({
  iframeRef,
  pins,
  handleImageClick
}: {
  iframeRef: React.RefObject<HTMLIFrameElement>
  pins: { x: number; y: number; num?: number }[]
  handleImageClick: (x: number, y: number) => void
}) {
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let iframeDoc: Document
    let body: HTMLElement

    const renderPinsInIframe = () => {
      if (!iframeDoc || !body) return

      const existing = iframeDoc.querySelectorAll('.pin-custom')
      existing.forEach(el => el.remove())

      pins.forEach((pin) => {
        const el = iframeDoc.createElement('div')
        el.className = 'pin-custom'
        el.innerText = `${pin.num || ''}`

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
        })

        body.appendChild(el)
      })
    }

    const onClick = async (e: MouseEvent) => {
      const rect = body.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      await handleImageClick(x, y)
    }

    const onLoad = () => {
      iframeDoc = iframe.contentDocument!
      body = iframeDoc.body

      body.style.position = 'relative'
      body.style.cursor = 'crosshair'
      body.addEventListener('click', onClick)

      renderPinsInIframe()
    }

    iframe.addEventListener('load', onLoad)

    return () => {
      iframe.removeEventListener('load', onLoad)
      iframe.contentDocument?.body?.removeEventListener('click', onClick)
    }
  }, [pins, handleImageClick])
}
