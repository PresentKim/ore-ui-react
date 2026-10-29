import type { ReactElement } from 'react'
import type { TextBlockProps } from '@ore-ui-react/core/src/textblock'
import { InlineTextBlock as OreInline, TextBlock as OreBlock } from '@ore-ui-react/oreui/src/TextBlock/TextBlock'
import { InlineTextBlock as JsonInline, TextBlock as JsonBlock } from '@ore-ui-react/jsonui/src/TextBlock/TextBlock'
import type { Demo } from '../catalog'

type Parts = { Block: (props: TextBlockProps) => ReactElement; Inline: (props: TextBlockProps) => ReactElement }

const TextBlockDemo = ({ Block }: Parts) => (
  <div style={{ width: '24rem', maxWidth: '100%' }}>
    <Block variant="title" text="Title" />
    <Block variant="body" text="Body text <b>is literal</b>" />
    <Block variant="caption" text="Caption" />
  </div>
)

const InlineDemo = ({ Inline }: Parts) => (
  <div style={{ width: '24rem', maxWidth: '100%' }}>
    <Inline text="Inline " />
    <Inline variant="title" text="title " />
    <Inline variant="caption" text="and caption" />
  </div>
)

const ore: Parts = { Block: OreBlock, Inline: OreInline }
const json: Parts = { Block: JsonBlock, Inline: JsonInline }

const demos: Record<string, Demo> = {
  textblock: {
    oreui: () => <TextBlockDemo {...ore} />,
    jsonui: () => <TextBlockDemo {...json} />,
    code: `import { TextBlock } from '@ore-ui-react/oreui'

<TextBlock variant="title" text="Title" />
<TextBlock variant="body" text={textFacet} />
<TextBlock variant="caption">Caption</TextBlock>`,
  },
  inlinetextblock: {
    oreui: () => <InlineDemo {...ore} />,
    jsonui: () => <InlineDemo {...json} />,
    code: `import { InlineTextBlock } from '@ore-ui-react/oreui'

<InlineTextBlock text="Inline " />
<InlineTextBlock variant="title" text="title " />
<InlineTextBlock variant="caption" text="and caption" />`,
  },
}

export default demos
