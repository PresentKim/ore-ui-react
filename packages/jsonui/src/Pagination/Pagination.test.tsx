import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Pagination } from './Pagination'

const setup = (props: { page?: number; pageCount?: number; loop?: boolean; disabled?: boolean } = {}) => {
  const page = createFacet({ initialValue: props.page ?? 1 })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(
    <Pagination
      pageCount={props.pageCount ?? 10}
      page={page}
      loop={props.loop}
      disabled={disabled}
      onChange={onChange}
    />,
  )
  const q = (selector: string) => view.container.querySelector(selector) as HTMLElement
  const pages = Array.from(view.container.querySelectorAll('.jui-pagination-page')) as HTMLElement[]
  const shown = () => pages.filter((el) => el.style.display !== 'none').map((el) => el.textContent)
  return { page, disabled, onChange, prev: q('.jui-pagination-prev'), next: q('.jui-pagination-next'), pages, shown }
}

describe('jsonui Pagination', () => {
  it('shows the window around the page', () => {
    const { shown, page } = setup({ page: 5 })
    expect(shown()).toEqual(['3', '4', '5', '6', '7'])
    page.set(10)
    expect(shown()).toEqual(['6', '7', '8', '9', '10'])
  })

  it('hides slots beyond the page count', () => {
    expect(setup({ page: 2, pageCount: 3 }).shown()).toEqual(['1', '2', '3'])
  })

  it('marks the current page on', () => {
    const { pages } = setup({ page: 5 })
    expect(pages[2].classList.contains('on')).toBe(true)
  })

  it('pressing a page calls onChange', () => {
    const { pages, onChange } = setup({ page: 5 })
    fireEvent.mouseDown(pages[4], { button: 0 })
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('pressing the current page does nothing', () => {
    const { pages, onChange } = setup({ page: 5 })
    fireEvent.mouseDown(pages[2], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('bounds: prev disabled on page 1, next on the last page', () => {
    const { prev, next, page, onChange } = setup({ page: 1, pageCount: 4 })
    expect(prev.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
    page.set(4)
    expect(next.classList.contains('disabled')).toBe(true)
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('loop wraps', () => {
    const { prev, next, page, onChange } = setup({ page: 1, pageCount: 4, loop: true })
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(4)
    page.set(4)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('next and prev step by one', () => {
    const { prev, next, onChange } = setup({ page: 3 })
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(4)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('disabled ignores presses', () => {
    const { next, pages, disabled, onChange } = setup({ page: 3 })
    disabled.set(true)
    fireEvent.mouseDown(next, { button: 0 })
    fireEvent.mouseDown(pages[0], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('right button ignored', () => {
    const { next, onChange } = setup({ page: 3 })
    fireEvent.mouseDown(next, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
