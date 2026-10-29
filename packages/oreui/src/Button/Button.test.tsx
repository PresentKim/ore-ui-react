import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Button } from './Button'

const root = (container: HTMLElement) => container.querySelector('.oui-button') as HTMLElement

describe('Button', () => {
  it('renders children text', () => {
    const { container } = render(<Button>Play</Button>)
    expect(container.textContent).toContain('Play')
  })

  it('defaults to secondary', () => {
    const { container } = render(<Button>Play</Button>)
    expect(root(container).className).toBe('oui-button oui-button-secondary')
  })

  it('applies the variant class', () => {
    const { container } = render(<Button variant="primary">Play</Button>)
    expect(root(container).className).toBe('oui-button oui-button-primary')
  })

  it('calls onPress once on left mousedown', () => {
    const onPress = vi.fn()
    const { container } = render(<Button onPress={onPress}>Play</Button>)
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('ignores right click', () => {
    const onPress = vi.fn()
    const { container } = render(<Button onPress={onPress}>Play</Button>)
    fireEvent.mouseDown(root(container), { button: 2 })
    expect(onPress).not.toHaveBeenCalled()
  })

  it('ignores a disabled press', () => {
    const onPress = vi.fn()
    const { container } = render(
      <Button onPress={onPress} disabled={true}>
        Play
      </Button>,
    )
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).not.toHaveBeenCalled()
    expect(root(container).className).toContain('disabled')
  })

  it('follows the disabled facet', () => {
    const onPress = vi.fn()
    const disabled = createFacet({ initialValue: false })
    const { container } = render(
      <Button onPress={onPress} disabled={disabled}>
        Play
      </Button>,
    )
    expect(root(container).className).not.toContain('disabled')
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(root(container).className).toContain('disabled')
    fireEvent.mouseDown(root(container), { button: 0 })
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
