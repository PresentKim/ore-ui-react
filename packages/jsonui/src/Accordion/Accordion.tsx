import { createContext, useContext, useMemo, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import type {
  AccordionContextValue,
  AccordionItemProps,
  AccordionProps,
} from '@ore-ui-react/core/src/accordion'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import './accordion.css'

const AccordionContext = createContext<AccordionContextValue | null>(null)

export const Accordion = ({ multiple = false, expanded, defaultExpanded, disabled, onChange, children }: AccordionProps) => {
  const [internal, setInternal] = useFacetState<string[]>(defaultExpanded ?? [])
  const controlled = useFacetWrap<string[]>(expanded ?? [])
  const expandedFacet = expanded === undefined ? internal : controlled
  const disabledFacet = useFacetWrap(disabled ?? false)

  const latest = useRef<string[]>([])
  useFacetEffect(
    (open) => {
      latest.current = open
    },
    [],
    [expandedFacet],
  )

  const context = useMemo<AccordionContextValue>(
    () => ({
      expanded: expandedFacet,
      disabled: disabledFacet,
      toggle: (id) => {
        const current = latest.current
        const next = current.includes(id)
          ? current.filter((open) => open !== id)
          : multiple
            ? [...current, id]
            : [id]
        setInternal(next)
        onChange?.(next)
      },
    }),
    [expandedFacet, disabledFacet, multiple, setInternal, onChange],
  )

  const className = useFacetMap((isDisabled) => `jui-accordion${isDisabled ? ' disabled' : ''}`, [], [disabledFacet])

  return (
    <AccordionContext.Provider value={context}>
      <fast-div className={className}>{children}</fast-div>
    </AccordionContext.Provider>
  )
}

export const AccordionItem = ({ id, title, disabled, children }: AccordionItemProps) => {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('AccordionItem must be used inside Accordion')
  const { expanded, disabled: accordionDisabled, toggle } = context
  const itemDisabled = useFacetWrap(disabled ?? false)

  const isOpen = useFacetMap((open) => open.includes(id), [id], [expanded])
  const blocked = useFacetMap((accordion, item) => accordion || item, [], [accordionDisabled, itemDisabled])
  const className = useFacetMap(
    (open, isBlocked) => `jui-accordion-item${open ? ' open' : ''}${isBlocked ? ' disabled' : ''}`,
    [],
    [isOpen, blocked],
  )
  const bodyDisplay = useFacetMap((open) => (open ? 'block' : 'none'), [], [isOpen])

  const press = useFacetCallback(
    (isBlocked: boolean) => (event: MouseEvent) => {
      if (isBlocked || !isPrimaryPress(event)) return
      toggle(id)
    },
    [id, toggle],
    [blocked],
  )

  return (
    <fast-div className={className}>
      <fast-div className="jui-accordion-heading" onMouseDown={press}>
        <fast-div className="jui-accordion-title">{title}</fast-div>
        <fast-div className="jui-accordion-chevron" />
      </fast-div>
      <fast-div className="jui-accordion-body" style={{ display: bodyDisplay }}>
        {children}
      </fast-div>
    </fast-div>
  )
}
