# ore-ui-react

A react-facet component library with two skins: the Mojang Ore UI look and the vanilla JSON UI look. Both skins render the same props, so a screen can switch skins without changing its logic. A Vite docs app walks the [Gameface UI component catalog](https://gameface-ui.coherent-labs.com/components/) and draws each ready component in both skins side by side.

Ready components: Button, Checkbox, ToggleButton, Slider. The rest of the catalog is listed as planned in the docs app.

## Packages

- `@ore-ui-react/core`: shared prop types, `usePress`, and slider range math.
- `@ore-ui-react/oreui`: components with the Ore UI look (class prefix `oui-`).
- `@ore-ui-react/jsonui`: components with the vanilla JSON UI look (class prefix `jui-`).
- `@ore-ui-react/docs`: the docs app (`apps/docs`).

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
