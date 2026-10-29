import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { usePress } from './press'
import type { FacetProp } from './props'

const Target = ({ onPress, disabled }: { onPress?: () => void; disabled?: FacetProp<boolean> }) => (
  <fast-div className="target" onMouseDown={usePress(onPress, disabled)} />
)

const mount = (onPress: () => void, disabled?: FacetProp<boolean>) => {
  const { container } = render(<Target onPress={onPress} disabled={disabled} />)
  return container.querySelector('.target') as Element
}

describe('usePress', () => {
  it('calls onPress on left button', () => {
    const spy = vi.fn()
    fireEvent.mouseDown(mount(spy), { button: 0 })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('ignores right button', () => {
    const spy = vi.fn()
    fireEvent.mouseDown(mount(spy), { button: 2 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('ignores press when disabled', () => {
    const spy = vi.fn()
    fireEvent.mouseDown(mount(spy, true), { button: 0 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('reads the disabled facet at press time', () => {
    const spy = vi.fn()
    const disabled = createFacet({ initialValue: false })
    const target = mount(spy, disabled)
    fireEvent.mouseDown(target, { button: 0 })
    expect(spy).toHaveBeenCalledTimes(1)
    disabled.set(true)
    fireEvent.mouseDown(target, { button: 0 })
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
