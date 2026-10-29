import type { ReactElement } from 'react'
import { useFacetState } from '@react-facet/core'
import { Tab as OreTab, TabLink as OreTabLink, Tabs as OreTabs } from '@ore-ui-react/oreui/src/Tabs/Tabs'
import { Tab as JsonTab, TabLink as JsonTabLink, Tabs as JsonTabs } from '@ore-ui-react/jsonui/src/Tabs/Tabs'
import type { Demo } from '../catalog'

type Skin = { Tabs: typeof OreTabs; TabLink: typeof OreTabLink; Tab: typeof OreTab }

const ore: Skin = { Tabs: OreTabs, TabLink: OreTabLink, Tab: OreTab }
const json: Skin = { Tabs: JsonTabs, TabLink: JsonTabLink, Tab: JsonTab }

const TabsDemo = ({ skin: { Tabs, TabLink, Tab } }: { skin: Skin }) => {
  const [active, setActive] = useFacetState('general')
  return (
    <Tabs active={active} onChange={setActive}>
      <TabLink id="general">General</TabLink>
      <TabLink id="video">Video</TabLink>
      <TabLink id="audio" disabled>
        Audio
      </TabLink>
      <Tab id="general">General settings</Tab>
      <Tab id="video">Video settings</Tab>
    </Tabs>
  )
}

const code = `const [active, setActive] = useFacetState('general')

<Tabs active={active} onChange={setActive}>
  <TabLink id="general">General</TabLink>
  <TabLink id="video">Video</TabLink>
  <Tab id="general">General settings</Tab>
  <Tab id="video">Video settings</Tab>
</Tabs>`

const demo = (): Demo => ({
  oreui: (): ReactElement => <TabsDemo skin={ore} />,
  jsonui: (): ReactElement => <TabsDemo skin={json} />,
  code,
})

const demos: Record<string, Demo> = { tabs: demo(), tab: demo(), tablink: demo() }

export default demos
