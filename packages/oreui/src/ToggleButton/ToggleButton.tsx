import { useFacetCallback, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import { isPrimaryPress } from '@ore-ui-react/core'
import type { ToggleButtonProps } from '@ore-ui-react/core'
import { useEffect, useRef } from 'react'
import './toggle-button.css'

function Bevel() {
  return (
    <>
      <fast-div className="oui-toggle-button-bevel oui-toggle-button-bevel-tl" />
      <fast-div className="oui-toggle-button-bevel oui-toggle-button-bevel-br" />
    </>
  )
}

export function ToggleButton({ value, disabled = false, onChange }: ToggleButtonProps) {
  const on = useFacetWrap(value)
  const isDisabled = useFacetWrap(disabled)
  const [sliding, setSliding] = useFacetState(false)
  const rootClass = useFacetMap(
    (off) => (off ? 'oui-toggle-button disabled' : 'oui-toggle-button'),
    [],
    [isDisabled],
  )
  const thumbClass = useFacetMap(
    (isOn, isSliding) =>
      'oui-toggle-button-thumb ' + (isOn ? (isSliding ? 'to-on' : 'on') : isSliding ? 'to-off' : 'off'),
    [],
    [on, sliding],
  )
  const thumbRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const thumb = thumbRef.current
    if (!thumb) return
    const stop = () => setSliding(false)
    thumb.addEventListener('animationend', stop)
    return () => thumb.removeEventListener('animationend', stop)
  }, [setSliding])
  const press = useFacetCallback(
    (isOn, off) => (event: MouseEvent) => {
      if (off || !isPrimaryPress(event)) return
      setSliding(true)
      onChange?.(!isOn)
    },
    [onChange, setSliding],
    [on, isDisabled],
  )

  return (
    <fast-div className={rootClass} onMouseDown={press}>
      <fast-div className="oui-toggle-button-track">
        <fast-div className="oui-toggle-button-half oui-toggle-button-on">
          <fast-div className="oui-toggle-button-on-icon" />
          <Bevel />
        </fast-div>
        <fast-div className="oui-toggle-button-half oui-toggle-button-off">
          <fast-div className="oui-toggle-button-ring">
            <fast-div className="oui-toggle-button-ring-h" />
            <fast-div className="oui-toggle-button-ring-v" />
          </fast-div>
        </fast-div>
        <fast-div ref={thumbRef} className={thumbClass}>
          <fast-div className="oui-toggle-button-face">
            <fast-div className="oui-toggle-button-face-top">
              <Bevel />
            </fast-div>
            <fast-div className="oui-toggle-button-shade" />
          </fast-div>
        </fast-div>
      </fast-div>
    </fast-div>
  )
}
