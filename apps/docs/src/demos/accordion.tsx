import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { AccordionItemProps, AccordionProps } from '@ore-ui-react/core/src/accordion'
import { Accordion as OreAccordion, AccordionItem as OreItem } from '@ore-ui-react/oreui/src/Accordion/Accordion'
import { Accordion as JsonAccordion, AccordionItem as JsonItem } from '@ore-ui-react/jsonui/src/Accordion/Accordion'
import type { Demo } from '../catalog'

type Parts = {
  Accordion: (props: AccordionProps) => ReactElement
  AccordionItem: (props: AccordionItemProps) => ReactElement
}

const AccordionDemo = ({ Accordion, AccordionItem }: Parts) => {
  const [open, setOpen] = useFacetState<string[]>(['world'])
  const status = useFacetMap((ids) => `Open: ${ids.join(', ') || 'none'}`, [], [open])

  return (
    <div style={{ width: '24rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Accordion multiple expanded={open} onChange={setOpen}>
          <AccordionItem id="world" title="World">
            Seed, difficulty and game mode.
          </AccordionItem>
          <AccordionItem id="packs" title="Packs">
            Resource and behavior packs.
          </AccordionItem>
          <AccordionItem id="cheats" title="Cheats" disabled>
            Locked section.
          </AccordionItem>
        </Accordion>
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  accordion: {
    oreui: () => <AccordionDemo Accordion={OreAccordion} AccordionItem={OreItem} />,
    jsonui: () => <AccordionDemo Accordion={JsonAccordion} AccordionItem={JsonItem} />,
    code: `const [open, setOpen] = useFacetState<string[]>(['world'])

<Accordion multiple expanded={open} onChange={setOpen}>
  <AccordionItem id="world" title="World">Seed, difficulty and game mode.</AccordionItem>
  <AccordionItem id="packs" title="Packs">Resource and behavior packs.</AccordionItem>
  <AccordionItem id="cheats" title="Cheats" disabled>Locked section.</AccordionItem>
</Accordion>`,
  },
}

export default demos
