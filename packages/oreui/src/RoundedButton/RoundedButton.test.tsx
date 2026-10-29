import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { RoundedButton } from './RoundedButton'

const root = (container: HTMLElement) => container.querySelector('.oui-roundedbutton') as HTMLElement

describe('RoundedButton', () => {
  it('renders children and defaults to medium', () => {
    const { container } = render(<RoundedButton>Go</RoundedButton>)
    expect(container.textContent).toBe('Go')
    expect(root(container).className).toBe('oui-roundedbutton oui-roundedbutton-medium')
  })

  it.each(['small', 'medium', 'large'] as const)('size %s sets the class', (size) => {
    const { container } = render(<RoundedButton size={size}>Go</RoundedButton>)
    expect(root(container).className).toBe(`oui-roundedbutton oui-roundedbutton-${size}`)
  })

  it('calls onPress once on left mousedown', () => {
    const onPress = vi.fn()
    const { container } = render(<RoundedButton onPress={onPress}>Go</RoundedButton>)
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('ignores right click', () => {
    const onPress = vi.fn()
    const { container } = render(<RoundedButton onPress={onPress}>Go</RoundedButton>)
    fireEvent.mouseDown(root(container), { button: 2 })
    expect(onPress).not.toHaveBeenCalled()
  })

  it('ignores a disabled press', () => {
    const onPress = vi.fn()
    const { container } = render(
      <RoundedButton onPress={onPress} disabled>
        Go
      </RoundedButton>,
    )
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).not.toHaveBeenCalled()
    expect(root(container).className).toContain('disabled')
  })

  it('follows the disabled facet flip', () => {
    const onPress = vi.fn()
    const disabled = createFacet({ initialValue: false })
    const { container } = render(
      <RoundedButton onPress={onPress} disabled={disabled}>
        Go
      </RoundedButton>,
    )
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(root(container).className).toContain('disabled')
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
    disabled.set(false)
    expect(root(container).className).not.toContain('disabled')
  })
})
