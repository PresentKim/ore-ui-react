import { Profiler } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { ProgressBar, ProgressCircle } from './Progress'

const fill = (container: HTMLElement) => container.querySelector('.oui-progress-fill') as HTMLElement
const halves = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.oui-progress-half')) as HTMLElement[]

describe('ProgressBar', () => {
  it('sets the fill width to the percent', () => {
    const { container } = render(<ProgressBar value={40} />)
    expect(fill(container).style.width).toBe('40%')
  })

  it('clamps 150 to 100%', () => {
    const { container } = render(<ProgressBar value={150} />)
    expect(fill(container).style.width).toBe('100%')
  })

  it('clamps negatives to 0%', () => {
    const { container } = render(<ProgressBar value={-5} />)
    expect(fill(container).style.width).toBe('0%')
  })

  it('updates from the facet without re-render', () => {
    const value = createFacet({ initialValue: 10 })
    const onRender = vi.fn()
    const { container } = render(
      <Profiler id="p" onRender={onRender}>
        <ProgressBar value={value} />
      </Profiler>,
    )
    const renders = onRender.mock.calls.length
    act(() => value.set(70))
    expect(fill(container).style.width).toBe('70%')
    expect(onRender.mock.calls.length).toBe(renders)
  })
})

describe('ProgressCircle', () => {
  it('labels the percent', () => {
    const { container } = render(<ProgressCircle value={42} />)
    expect(container.textContent).toContain('42%')
  })

  it('clamps the label at 100%', () => {
    const { container } = render(<ProgressCircle value={150} />)
    expect(container.textContent).toContain('100%')
  })

  it('draws two half-discs without svg', () => {
    const { container } = render(<ProgressCircle value={25} />)
    expect(halves(container)).toHaveLength(2)
    expect(container.querySelector('svg')).toBeNull()
    expect(halves(container)[0].style.transform).toBe('rotate(-90deg)')
    expect(halves(container)[1].style.transform).toBe('rotate(-180deg)')
  })

  it('rotates both halves past 50%', () => {
    const { container } = render(<ProgressCircle value={100} />)
    expect(halves(container)[0].style.transform).toBe('rotate(0deg)')
    expect(halves(container)[1].style.transform).toBe('rotate(0deg)')
  })

  it('updates from the facet without re-render', () => {
    const value = createFacet({ initialValue: 0 })
    const onRender = vi.fn()
    const { container } = render(
      <Profiler id="p" onRender={onRender}>
        <ProgressCircle value={value} />
      </Profiler>,
    )
    const renders = onRender.mock.calls.length
    act(() => value.set(50))
    expect(halves(container)[0].style.transform).toBe('rotate(0deg)')
    expect(container.textContent).toContain('50%')
    expect(onRender.mock.calls.length).toBe(renders)
  })
})
