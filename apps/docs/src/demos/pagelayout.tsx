import type { ReactElement } from 'react'
import { Bottom, Content, Layout, Top } from '@ore-ui-react/primitives/src/PageLayout'
import { Absolute, Layout3D, Relative, Transform } from '@ore-ui-react/primitives/src/Position'
import type { Demo } from '../catalog'

const tile = { background: '#3a3a3a', color: '#fff', padding: '0.4rem', boxSizing: 'border-box' } as const
const frame = { width: '20rem', height: '12rem', border: '1px solid #888', boxSizing: 'border-box' } as const

const both = (render: () => ReactElement, code: string): Demo => ({
  oreui: render,
  jsonui: render,
  code,
})

const demos: Record<string, Demo> = {
  layout: both(
    () => (
      <div style={frame}>
        <Layout>
          <Top style={tile}>Top</Top>
          <Content style={{ ...tile, background: '#555' }}>Content</Content>
          <Bottom style={tile}>Bottom</Bottom>
        </Layout>
      </div>
    ),
    `import { Layout, Top, Content, Bottom } from '@ore-ui-react/primitives'

<Layout>
  <Top>Top</Top>
  <Content>Content</Content>
  <Bottom>Bottom</Bottom>
</Layout>`,
  ),
  top: both(
    () => (
      <div style={frame}>
        <Layout>
          <Top basis={30} style={tile}>
            Top, basis 30
          </Top>
          <Content>Content</Content>
        </Layout>
      </div>
    ),
    `import { Layout, Top, Content } from '@ore-ui-react/primitives'

<Layout>
  <Top basis={30}>Top, basis 30</Top>
  <Content>Content</Content>
</Layout>`,
  ),
  content: both(
    () => (
      <div style={frame}>
        <Layout>
          <Top style={tile}>Top</Top>
          <Content basis={50} style={{ ...tile, background: '#555' }}>
            Content, basis 50
          </Content>
        </Layout>
      </div>
    ),
    `import { Layout, Top, Content } from '@ore-ui-react/primitives'

<Layout>
  <Top>Top</Top>
  <Content basis={50}>Content, basis 50</Content>
</Layout>`,
  ),
  bottom: both(
    () => (
      <div style={frame}>
        <Layout>
          <Content>Content</Content>
          <Bottom basis={25} style={tile}>
            Bottom, basis 25
          </Bottom>
        </Layout>
      </div>
    ),
    `import { Layout, Content, Bottom } from '@ore-ui-react/primitives'

<Layout>
  <Content>Content</Content>
  <Bottom basis={25}>Bottom, basis 25</Bottom>
</Layout>`,
  ),
  absolute: both(
    () => (
      <Relative style={frame}>
        <div>Normal flow</div>
        <Absolute top={2} left={4} style={tile}>
          top 2rem, left 4rem
        </Absolute>
        <Absolute bottom={1} right="1rem" style={tile}>
          bottom, right
        </Absolute>
        <Absolute center style={tile}>
          centered
        </Absolute>
      </Relative>
    ),
    `import { Relative, Absolute } from '@ore-ui-react/primitives'

<Relative>
  <Absolute top={2} left={4}>top 2rem, left 4rem</Absolute>
  <Absolute center>centered</Absolute>
</Relative>`,
  ),
  relative: both(
    () => (
      <div>
        <div style={tile}>Before</div>
        <Relative top={1} left={3} style={tile}>
          Offset 1rem down, 3rem right
        </Relative>
        <div style={tile}>After</div>
      </div>
    ),
    `import { Relative } from '@ore-ui-react/primitives'

<Relative top={1} left={3}>Offset</Relative>`,
  ),
  transform: both(
    () => (
      <div style={{ padding: '2rem' }}>
        <Transform rotate={{ z: 15 }} origin="top left" style={{ ...tile, width: '10rem' }}>
          rotate 15deg
        </Transform>
        <div style={{ height: '2rem' }} />
        <Transform matrix={{ translate: { x: 20 }, scale: { x: 1.2, y: 1.2 } }} style={{ ...tile, width: '10rem' }}>
          translate and scale
        </Transform>
      </div>
    ),
    `import { Transform } from '@ore-ui-react/primitives'

<Transform rotate={{ z: 15 }} origin="top left">rotate</Transform>
<Transform matrix={{ translate: { x: 20 }, scale: { x: 1.2, y: 1.2 } }}>both</Transform>`,
  ),
  layout3d: both(
    () => (
      <Layout3D distance="600px" style={{ padding: '2rem' }}>
        <Transform rotate={{ y: 40 }} style={{ ...tile, width: '10rem' }}>
          rotate 40deg on y
        </Transform>
      </Layout3D>
    ),
    `import { Layout3D, Transform } from '@ore-ui-react/primitives'

<Layout3D distance="600px">
  <Transform rotate={{ y: 40 }}>rotate on y</Transform>
</Layout3D>`,
  ),
}

export default demos
