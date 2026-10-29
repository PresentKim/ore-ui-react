import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import { keyLabel, mouseLabel, resolveBinding } from '@ore-ui-react/core/src/keybinds'
import type {
  Bindings,
  KeybindProps,
  KeybindsContextValue,
  KeybindsProps,
} from '@ore-ui-react/core/src/keybinds'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import './keybinds.css'

const KeybindsContext = createContext<KeybindsContextValue | null>(null)

export const Keybinds = ({
  bindings,
  conflict = 'swap',
  placeholder = '',
  listeningText = 'Press any key...',
  disabled,
  onChange,
  children,
}: KeybindsProps) => {
  const bindingsFacet = useFacetWrap<Bindings>(bindings)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const [listening, setListening] = useFacetState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const currentBindings = useRef<Bindings>({})
  const currentListening = useRef<string | null>(null)

  useFacetEffect(
    (value) => {
      currentBindings.current = value
    },
    [],
    [bindingsFacet],
  )
  useFacetEffect(
    (action) => {
      currentListening.current = action
    },
    [],
    [listening],
  )

  useEffect(() => {
    const assign = (key: string) => {
      const action = currentListening.current
      if (action === null) return
      const next = resolveBinding(currentBindings.current, action, key, conflict)
      setListening(null)
      if (next !== currentBindings.current) onChange?.(next)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (currentListening.current === null) return
      event.preventDefault()
      if (event.code === 'Escape') setListening(null)
      else assign(keyLabel(event))
    }
    const onMouseDown = (event: MouseEvent) => {
      if (currentListening.current === null) return
      if (event.button > 0) {
        event.preventDefault()
        assign(mouseLabel(event.button))
        return
      }
      const root = rootRef.current
      if (root && event.target instanceof Node && root.contains(event.target)) return
      setListening(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [conflict, onChange, setListening])

  const context = useMemo<KeybindsContextValue>(
    () => ({
      bindings: bindingsFacet,
      listening,
      disabled: disabledFacet,
      placeholder,
      listeningText,
      toggle: (action) => setListening(currentListening.current === action ? null : action),
    }),
    [bindingsFacet, listening, disabledFacet, placeholder, listeningText, setListening],
  )

  const className = useFacetMap((off) => `oui-keybinds${off ? ' disabled' : ''}`, [], [disabledFacet])

  return (
    <KeybindsContext.Provider value={context}>
      <fast-div className={className} ref={rootRef}>
        {children}
      </fast-div>
    </KeybindsContext.Provider>
  )
}

export const Keybind = ({ action, label }: KeybindProps) => {
  const context = useContext(KeybindsContext)
  if (!context) throw new Error('Keybind must be used inside Keybinds')
  const { bindings, listening, disabled, placeholder, listeningText, toggle } = context

  const here = useFacetMap((current) => current === action, [action], [listening])
  const bound = useFacetMap((value) => value[action] != null, [action], [bindings])
  const keyText = useFacetMap((value) => value[action] ?? '', [action], [bindings])

  const rowClass = useFacetMap(
    (isHere, off) => `oui-keybind${isHere ? ' listening' : ''}${off ? ' disabled' : ''}`,
    [],
    [here, disabled],
  )
  const keyDisplay = useFacetMap((isHere, isBound) => (!isHere && isBound ? 'block' : 'none'), [], [here, bound])
  const placeholderDisplay = useFacetMap((isHere, isBound) => (!isHere && !isBound ? 'block' : 'none'), [], [here, bound])
  const listeningDisplay = useFacetMap((isHere) => (isHere ? 'block' : 'none'), [], [here])

  const press = useFacetCallback(
    (off: boolean) => (event: MouseEvent) => {
      if (off || !isPrimaryPress(event)) return
      toggle(action)
    },
    [action, toggle],
    [disabled],
  )

  return (
    <fast-div className={rowClass}>
      <fast-div className="oui-keybind-label">{label ?? action}</fast-div>
      <fast-div className="oui-keybind-slot" onMouseDown={press}>
        <fast-div className="oui-keybind-key" style={{ display: keyDisplay }}>
          <fast-text text={keyText} />
        </fast-div>
        <fast-div className="oui-keybind-placeholder" style={{ display: placeholderDisplay }}>
          {placeholder}
        </fast-div>
        <fast-div className="oui-keybind-listening" style={{ display: listeningDisplay }}>
          {listeningText}
        </fast-div>
      </fast-div>
    </fast-div>
  )
}
