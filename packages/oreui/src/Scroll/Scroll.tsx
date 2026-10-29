import { useScroll } from '@ore-ui-react/core/src/scroll'
import type { ScrollProps } from '@ore-ui-react/core/src/scroll'
import './scroll.css'

export const Scroll = ({ children, end = false, minThumb }: ScrollProps) => {
  const scroll = useScroll(end, minThumb)

  return (
    <fast-div className="oui-scroll">
      <fast-div ref={scroll.contentRef} className="oui-scroll-content">
        {children}
      </fast-div>
      <fast-div
        ref={scroll.barRef}
        className="oui-scroll-bar"
        style={{ display: scroll.display }}
        onMouseDown={scroll.onBarMouseDown}
      >
        <fast-div className="oui-scroll-track" />
        <fast-div
          className="oui-scroll-handle"
          style={{ top: scroll.top, height: scroll.height }}
          onMouseDown={scroll.onHandlePress}
          onTouchStart={scroll.onHandlePress}
        />
      </fast-div>
    </fast-div>
  )
}
