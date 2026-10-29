import { describe, expect, it } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { Image, MaskImage } from './Image'

const rootOf = (view: { container: HTMLElement }) => view.container.firstElementChild as HTMLElement

describe('Image', () => {
  it('renders src as a contained 3.5rem background by default', () => {
    const box = rootOf(render(<Image src="a.png" />))
    expect(box.style.backgroundImage).toContain('a.png')
    expect(box.style.backgroundSize).toBe('contain')
    expect(box.style.width).toBe('3.5rem')
    expect(box.style.height).toBe('3.5rem')
  })

  it('fill sets full width and height', () => {
    const box = rootOf(render(<Image src="a.png" fill />))
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
  })

  it('options switch to background mode without a default size', () => {
    const box = rootOf(render(<Image src="a.png" options={{ size: 'cover', repeat: 'x', position: 'top' }} />))
    expect(box.style.width).toBe('')
    expect(box.style.backgroundSize).toBe('cover')
    expect(box.style.backgroundRepeat).toBe('repeat-x')
    expect(box.style.backgroundPosition).toBe('center top')
  })

  it('updates when the src facet changes', () => {
    const src = createFacet<string>({ initialValue: 'a.png' })
    const box = rootOf(render(<Image src={src} />))
    act(() => src.set('b.png'))
    expect(box.style.backgroundImage).toContain('b.png')
  })
})

describe('MaskImage', () => {
  it('sets mask-image and renders children', () => {
    const view = render(
      <MaskImage src="m.png" options={{ size: 'contain', repeat: 'both' }}>
        content
      </MaskImage>,
    )
    const box = rootOf(view)
    expect(box.getAttribute('style')).toContain('m.png')
    expect(box.getAttribute('style')).toContain('mask-size: contain')
    expect(box.getAttribute('style')).toContain('mask-repeat: repeat')
    expect(box.textContent).toBe('content')
  })

  it('fill sets full width and height', () => {
    const box = rootOf(render(<MaskImage src="m.png" fill />))
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
  })
})
