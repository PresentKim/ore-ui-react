# ore-ui-react

A react-facet component library with two skins: the Mojang Ore UI look and the vanilla JSON UI look. Both skins render the same props, so a screen can switch skins without changing its logic. A Vite docs app walks the [Gameface UI component catalog](https://gameface-ui.coherent-labs.com/components/) and draws each ready component in both skins side by side.

An entry in the docs app is ready exactly when it has a demo. The remaining entries are listed as planned.

## Packages

- `@ore-ui-react/core`: shared prop types, `usePress`, slider range math, and the pure helpers behind each component.
- `@ore-ui-react/oreui`: components with the Ore UI look (class prefix `oui-`).
- `@ore-ui-react/jsonui`: components with the vanilla JSON UI look (class prefix `jui-`).
- `@ore-ui-react/primitives`: layout boxes and helpers with no skin.
- `@ore-ui-react/docs`: the docs app (`apps/docs`).

## Components

Core exports the props and helpers for each component below. Both skins export the same components.

- oreui and jsonui: Accordion, AccordionItem, BarChart, LineChart, Button, Carousel, Checkbox, ColorPicker, Dropdown, TextInput, PasswordInput, NumberInput, Keybinds, Keybind, Modal, Pagination, ProgressBar, ProgressCircle, RadialMenu, Radio, RadioGroup, RoundedButton, Scroll, Segment, SegmentButton, Slider, Stepper, Tabs, TabLink, Tab, TextBlock, InlineTextBlock, TextSlider, ToastHost, ToggleButton, Tooltip, Tutorial, TwoHandleSlider, XYSlider.
- primitives: SizedBox, Block, Flex, Row, Column, Grid, GridTile, Layout, Top, Content, Bottom, Absolute, Relative, Transform, Layout3D, List, ListItem, State, Match, Image, MaskImage, and the `guiSize`, `sizeClassOf` and `useSizeClass` helpers.

Not implemented: LiveView, pie and donut charts (charts are bar and line only), and gamepad keybinds (Keybinds handles keyboard and mouse).

## SizedBox

`SizedBox` is a div with a size in GUI pixels (1 GUI px is 0.2rem) that never grows past `96vw` by `96vh`. Strings pass through as CSS lengths. Screen-sized boxes use `vw` and `vh`, never percent.

```tsx
import { SizedBox, useSizeClass } from '@ore-ui-react/primitives'

const sizeClass = useSizeClass()

<SizedBox width={326} height={166}>window</SizedBox>
<SizedBox width="50vw" maxWidth="20rem">capped</SizedBox>
<SizedBox fixed width={80}>no shrink</SizedBox>
```

`fixed` sets `flex-shrink: 0`, because Gameface ignores `min-width: 0`. `useSizeClass` returns a facet of `'s'`, `'m'` or `'l'` (under 64rem, under 100rem, and wider), computed from `innerWidth / rem` because Gameface has no `@media`.

## Install

The packages are not published. Clone the repository and install the workspaces:

```
npm install
```

Packages ship TypeScript source (`main` is `src/index.ts`), so a consumer in the same workspace imports them directly.

## Usage

Value props are facets (or plain values). Components are controlled: they report changes through `onChange` or `onPress` and never set their own value.

```tsx
import { createFacet } from '@react-facet/core'
import { createRoot } from '@react-facet/dom-fiber'
import { Button, Checkbox, Slider, ToggleButton } from '@ore-ui-react/oreui'

const checked = createFacet({ initialValue: false })
const volume = createFacet({ initialValue: 40 })

createRoot(document.getElementById('root')!).render(
  <div>
    <Button variant="primary" onPress={() => console.log('play')}>
      Play
    </Button>
    <Checkbox checked={checked} label="Show hints" onChange={checked.set} />
    <ToggleButton value={checked} onChange={checked.set} />
    <Slider value={volume} min={0} max={100} step={1} onChange={volume.set} />
  </div>,
)
```

Import from `@ore-ui-react/jsonui` instead to get the vanilla JSON UI look with the same props.

## Docs app

```
npm run dev
```

`npm run build:docs` builds the app, `npm test` runs the tests, and `npm run typecheck` checks the types.

## Test pack

`apps/test-pack` is a resource pack that replaces `gameplay.html` with an in-game gallery of every component: the docs demos, listed in a sidebar, with the Ore UI and JSON UI skins side by side. A badge at the bottom hides and shows the gallery.

```
npm run build -w @ore-ui-react/test-pack
```

The output is `apps/test-pack/dist/ore-ui-react-test.mcpack`. `npm run dev -w @ore-ui-react/test-pack` serves the same screen in a browser.

The `<script>` and `<link>` bundle names in `static/hbui/gameplay.html` must match the client version. Copy them from the install's `data/gui/dist/hbui/gameplay.html` and keep the two `oui-react-test` tags at the end of `<head>`. The pack needs the empty `content.zipe` so the client trusts the local pack and applies the `hbui` files, and every change needs a version bump in `static/manifest.json`.

## Gameface CSS rules

The target runtime is Coherent Gameface, which supports a subset of CSS. All CSS in this repository follows these rules:

- rem units.
- Flex and absolute positioning for layout.
- No `@media`.
- No `calc()` inside shorthand properties.
- No `min-width: 0`.
- Interaction uses `mousedown`, never `click`, because Gameface sends no `click` to divs.

## Asset policy

- Skins are CSS only. No images, fonts, or bundle code from the game are copied.
- Sizes, colors, and timings are measured from the vanilla game. Where a value could not be found, the component's CSS marks it as an estimate.
- No Minecraft font is shipped. Skins use `font-family: var(--oui-font, sans-serif)`.

See [NOTICE.md](NOTICE.md) for third-party references.

## License

MIT. See [LICENSE](LICENSE).
