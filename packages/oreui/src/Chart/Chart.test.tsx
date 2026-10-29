import { describe, expect, it } from 'vitest'
import { createFacet } from '@react-facet/core'
import { render, waitFor } from '@react-facet/dom-fiber-testing-library'
import { BarChart, LineChart } from './Chart'

const all = (container: HTMLElement, selector: string) => Array.from(container.querySelectorAll(selector)) as HTMLElement[]

describe('oreui BarChart', () => {
  it('renders one bar per value with height proportional to max', () => {
    const view = render(<BarChart data={[2, 4, 8]} />)
    const bars = all(view.container, '.oui-chart-bar')
    expect(bars.map((bar) => bar.style.height)).toEqual(['25%', '50%', '100%'])
  })

  it('empty_data renders no bars', () => {
    const view = render(<BarChart data={[]} />)
    expect(all(view.container, '.oui-chart-bar')).toHaveLength(0)
    expect(view.container.querySelector('.oui-chart-baseline')).not.toBeNull()
  })

  it('negative_values hang from the baseline', () => {
    const view = render(<BarChart data={[-4, 4]} />)
    const bars = all(view.container, '.oui-chart-bar')
    const baseline = view.container.querySelector('.oui-chart-baseline') as HTMLElement
    expect(baseline.style.bottom).toBe('50%')
    expect(bars[0].style.bottom).toBe('0%')
    expect(bars[0].style.height).toBe('50%')
    expect(bars[0].classList.contains('negative')).toBe(true)
    expect(bars[1].style.bottom).toBe('50%')
    expect(bars[1].classList.contains('negative')).toBe(false)
  })

  it('follows a data facet', async () => {
    const data = createFacet({ initialValue: [1, 2] })
    const view = render(<BarChart data={data} />)
    expect(all(view.container, '.oui-chart-bar')).toHaveLength(2)
    data.set([1, 2, 3])
    await waitFor(() => expect(all(view.container, '.oui-chart-bar')).toHaveLength(3))
  })
})

describe('oreui LineChart', () => {
  it('renders n-1 segments', () => {
    const view = render(<LineChart data={[1, 2, 3, 4]} />)
    expect(all(view.container, '.oui-chart-segment')).toHaveLength(3)
    expect(all(view.container, '.oui-chart-point')).toHaveLength(4)
  })

  it('empty_data and a single value render no segments', () => {
    expect(all(render(<LineChart data={[]} />).container, '.oui-chart-segment')).toHaveLength(0)
    expect(all(render(<LineChart data={[5]} />).container, '.oui-chart-segment')).toHaveLength(0)
  })

  it('places a segment from its first point', () => {
    const view = render(<LineChart data={[0, 8]} width={30} height={16} />)
    const segment = all(view.container, '.oui-chart-segment')[0]
    expect(segment.style.left).toBe('0rem')
    expect(segment.style.top).toBe('16rem')
    expect(segment.style.width).toBe('34rem')
    expect(segment.style.transform).toBe('rotate(-28.07deg)')
  })
})
