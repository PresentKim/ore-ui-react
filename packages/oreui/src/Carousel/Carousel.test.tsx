import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Carousel } from './Carousel'

const setup = (props: { page?: number; items?: number; itemsPerPage?: number; loop?: boolean } = {}) => {
  const page = createFacet({ initialValue: props.page ?? 1 })
  const onChange = vi.fn()
  const items = Array.from({ length: props.items ?? 4 }, (_, index) => <span key={index}>{index + 1}</span>)
  const view = render(
    <Carousel page={page} itemsPerPage={props.itemsPerPage} loop={props.loop} onChange={onChange}>
      {items}
    </Carousel>,
  )
  const q = (selector: string) => view.container.querySelector(selector) as HTMLElement
  return {
    page,
    onChange,
    prev: q('.oui-carousel-prev'),
    next: q('.oui-carousel-next'),
    track: q('.oui-carousel-track'),
    slides: Array.from(view.container.querySelectorAll('.oui-carousel-slide')) as HTMLElement[],
    dots: Array.from(view.container.querySelectorAll('.oui-carousel-dot')) as HTMLElement[],
  }
}

describe('oreui Carousel', () => {
  it('next and prev move by one page', () => {
    const { prev, next, onChange } = setup({ page: 2 })
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('dots show the page count and pressing one calls onChange', () => {
    const { dots, onChange } = setup({ items: 4 })
    expect(dots).toHaveLength(4)
    fireEvent.mouseDown(dots[2], { button: 0 })
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('pressing the current dot does nothing', () => {
    const { dots, onChange } = setup({ page: 2 })
    fireEvent.mouseDown(dots[1], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks the current dot on', () => {
    const { dots, page } = setup({ page: 2 })
    expect(dots[1].classList.contains('on')).toBe(true)
    page.set(3)
    expect(dots[1].classList.contains('on')).toBe(false)
    expect(dots[2].classList.contains('on')).toBe(true)
  })

  it('bounds: prev disabled on page 1, next on the last page', () => {
    const { prev, next, page, onChange } = setup({ page: 1, items: 3 })
    expect(prev.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
    page.set(3)
    expect(next.classList.contains('disabled')).toBe(true)
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('loop wraps', () => {
    const { prev, next, page, onChange } = setup({ page: 1, items: 3, loop: true })
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(3)
    page.set(3)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('items_per_page groups slides into pages', () => {
    const { dots, slides, track, page, next, onChange } = setup({ items: 5, itemsPerPage: 2 })
    expect(dots).toHaveLength(3)
    expect(slides[0].style.flexBasis).toBe('50%')
    expect(track.style.transform).toBe('translateX(0%)')
    page.set(2)
    expect(track.style.transform).toBe('translateX(-100%)')
    page.set(3)
    expect(next.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('right button ignored', () => {
    const { next, dots, onChange } = setup({ page: 2 })
    fireEvent.mouseDown(next, { button: 2 })
    fireEvent.mouseDown(dots[0], { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
