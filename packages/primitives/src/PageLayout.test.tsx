import { describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { Bottom, Content, Layout, Top } from './PageLayout'

describe('Layout', () => {
  const setup = (props: { topBasis?: number; contentBasis?: number } = {}) => {
    const view = render(
      <Layout>
        <Top basis={props.topBasis}>t</Top>
        <Content basis={props.contentBasis}>c</Content>
        <Bottom>b</Bottom>
      </Layout>,
    )
    const root = view.container.firstElementChild as HTMLElement
    return { root, kids: Array.from(root.children) as HTMLElement[] }
  }

  it('is a flex column of top, content, bottom', () => {
    const { root, kids } = setup()
    expect(root.style.display).toBe('flex')
    expect(root.style.flexDirection).toBe('column')
    expect(kids.map((kid) => kid.textContent)).toEqual(['t', 'c', 'b'])
  })

  it('grows Content only', () => {
    const { kids } = setup()
    expect(kids[1].style.flexGrow).toBe('1')
    expect(kids[0].style.flexGrow).toBe('0')
    expect(kids[2].style.flexGrow).toBe('0')
  })

  it('Top and Bottom default to a 15% basis', () => {
    const { kids } = setup()
    expect(kids[0].style.flexBasis).toBe('15%')
    expect(kids[2].style.flexBasis).toBe('15%')
  })

  it('takes basis as a percentage', () => {
    const { kids } = setup({ topBasis: 30, contentBasis: 50 })
    expect(kids[0].style.flexBasis).toBe('30%')
    expect(kids[1].style.flexBasis).toBe('50%')
  })

  it('Content basis defaults to auto', () => {
    expect(setup().kids[1].style.flexBasis).toBe('auto')
  })
})
