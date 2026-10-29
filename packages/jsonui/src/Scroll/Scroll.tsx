import { useScroll } from '@ore-ui-react/core/src/scroll'
import type { ScrollProps } from '@ore-ui-react/core/src/scroll'
import './scroll.css'

export const Scroll = ({ children, end = false, minThumb }: ScrollProps) => {
  const scroll = useScroll(end, minThumb)

  return (
    <fast-div className="jui-scroll">
      <fast-div ref={scroll.contentRef} className="jui-scroll-content">
        {children}
      </fast-div>
      <fast-div
        ref={scroll.barRef}
        className="jui-scroll-bar"
        style={{ display: scroll.display }}
        onMouseDown={scroll.onBarMouseDown}
      >
        <fast-div className="jui-scroll-rail" />
        <fast-div
          className="jui-scroll-handle"
          style={{ top: scroll.top, height: scroll.height }}
          onMouseDown={scroll.onHandleMouseDown}
        />
      </fast-div>
    </fast-div>
  )
}
