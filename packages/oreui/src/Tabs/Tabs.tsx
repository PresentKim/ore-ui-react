import { Mount, useFacetMap, useFacetWrap } from '@react-facet/core'
import { TabsContext, useTabLink, useTabPanel, useTabsValue } from '@ore-ui-react/core/src/tabs'
import type { TabLinkProps, TabProps, TabsProps } from '@ore-ui-react/core/src/tabs'
import './tabs.css'

export const Tabs = ({ active, onChange, children }: TabsProps) => (
  <TabsContext.Provider value={useTabsValue(active, onChange)}>
    <fast-div className="oui-tabs">{children}</fast-div>
  </TabsContext.Provider>
)

export const TabLink = ({ id, children, disabled }: TabLinkProps) => {
  const { isActive, onMouseDown } = useTabLink({ id, disabled })
  const disabledFacet = useFacetWrap(disabled ?? false)
  const className = useFacetMap(
    (active, off) => `oui-tablink${active ? ' active' : ''}${off ? ' disabled' : ''}`,
    [],
    [isActive, disabledFacet],
  )
  return (
    <fast-div className={className} onMouseDown={onMouseDown}>
      {children}
    </fast-div>
  )
}

export const Tab = ({ id, children }: TabProps) => (
  <Mount when={useTabPanel(id)}>
    <fast-div className="oui-tab">{children}</fast-div>
  </Mount>
)
