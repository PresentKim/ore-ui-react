import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { Mount,useFacetMap, useFacetWrap } from '@react-facet/core'
import { TabsContext, useTabLink, useTabPanel, useTabsValue } from '@ore-ui-react/core/src/tabs'
import type { TabLinkProps, TabProps, TabsProps } from '@ore-ui-react/core/src/tabs'
import './tabs.css'

const isTabLink = (child: ReactNode) => isValidElement(child) && child.type === TabLink

export const Tabs = ({ active, onChange, children }: TabsProps) => {
  const all = Children.toArray(children)
  const links = all.filter(isTabLink)
  const rest = all.filter((child) => !isTabLink(child))
  return (
    <TabsContext.Provider value={useTabsValue(active, onChange)}>
      <fast-div className="oui-tabs">
        {links.length > 0 && <fast-div className="oui-tabs-bar">{links}</fast-div>}
        {rest}
      </fast-div>
    </TabsContext.Provider>
  )
}

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
