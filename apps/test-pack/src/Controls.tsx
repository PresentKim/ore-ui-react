import { useEffect, useRef } from 'react'
import { Times, useFacetMap, useFacetState } from '@react-facet/core'
import type { Toasts } from '@ore-ui-react/core'
import type { Probe } from './probe'
import type { Skin } from './skins'
import { Row, Section } from './parts'

type EngineWindow = { engine?: { isAttached?: boolean }; __commands__?: object }

const DROPDOWN_OPTIONS = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
]

const RADIO_OPTIONS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
]

type ControlsProps = {
  skin: Skin
  probe: Probe
  toasts: Toasts
  setModalOpen: (open: boolean) => void
}

export const Controls = ({ skin, probe, toasts, setModalOpen }: ControlsProps) => {
  const { Button, ToggleButton, Slider, TextInput, Checkbox, Dropdown, RadioGroup, ProgressBar, Tooltip, TextBlock } = skin
  const { log, guard } = probe
  const [counter, setCounter] = useFacetState(0)
  const counterText = useFacetMap(String, [], [counter])
  const counterRef = useRef(0)
  const [on, setOn] = useFacetState(false)
  const [slider, setSlider] = useFacetState(50)
  const sliderRef = useRef(50)
  const sliderText = useFacetMap((value) => `${value}%`, [], [slider])
  const [text, setText] = useFacetState('')
  const textRef = useRef('')
  const [checked, setChecked] = useFacetState(false)
  const [choice, setChoice] = useFacetState<string | undefined>(undefined)
  const [radio, setRadio] = useFacetState<string | undefined>('a')
  const inputRef = useRef<HTMLDivElement>(null)
  const [boxes, setBoxes] = useFacetState(0)
  const boxesRef = useRef(0)

  useEffect(() => {
    const wrapper = inputRef.current
    if (!wrapper) return
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.keyCode === 13) log('input', `enter: ${textRef.current}`)
    }
    const onFocus = () => log('input', 'focus')
    const onBlur = () => log('input', 'blur')
    wrapper.addEventListener('keydown', onKeyDown)
    wrapper.addEventListener('focusin', onFocus)
    wrapper.addEventListener('focusout', onBlur)
    return () => {
      wrapper.removeEventListener('keydown', onKeyDown)
      wrapper.removeEventListener('focusin', onFocus)
      wrapper.removeEventListener('focusout', onBlur)
    }
  }, [log])

  const add = (delta: number) => {
    counterRef.current += delta
    setCounter(counterRef.current)
    log('button', `${delta > 0 ? '+1' : '-1'} -> ${counterRef.current}`)
  }

  const randomColor = () => {
    const color = `rgb(${[0, 0, 0].map(() => Math.floor(Math.random() * 256)).join(',')})`
    document.querySelectorAll<HTMLElement>('.tp-panel').forEach((panel) => {
      panel.style.borderColor = color
    })
    log('button', `border ${color}`)
  }

  const addBox = () => {
    boxesRef.current = boxesRef.current >= 10 ? 1 : boxesRef.current + 1
    setBoxes(boxesRef.current)
    log('button', `boxes ${boxesRef.current}`)
  }

  const engineInfo = () => {
    const win = window as unknown as EngineWindow
    const engine = win.engine
    log('engine', `typeof engine=${typeof engine}${engine ? ` attached=${engine.isAttached}` : ''}`)
    if (engine) log('engine', `keys: ${Object.keys(engine).slice(0, 20).join(',')}`)
    const commands = win.__commands__
    log('engine', `__commands__=${commands ? `${Object.keys(commands).length} groups` : typeof commands}`)
  }

  return (
    <div>
      <Section title="Controls (mousedown)">
        <Row>
          <Button onPress={guard('+1', () => add(1))}>+1</Button>
          <Button onPress={guard('-1', () => add(-1))}>-1</Button>
          <TextBlock text={counterText} className="tp-counter" />
          <ToggleButton
            value={on}
            onChange={guard('toggle', (value: boolean) => {
              setOn(value)
              log('button', `toggle ${value}`)
            })}
          />
        </Row>
        <Row>
          <Button onPress={guard('random color', randomColor)}>random color</Button>
          <Button onPress={guard('add box', addBox)}>add box</Button>
        </Row>
        <fast-div className="tp-boxes">
          <Times count={boxes}>
            {(index: number) => (
              <fast-div
                className="tp-box"
                style={{ backgroundColor: `rgb(${index * 25},${250 - index * 20},160)` }}
              />
            )}
          </Times>
        </fast-div>
        <Row>
          <Button onPress={guard('hold', probe.startHold)}>hold me</Button>
          <TextBlock text={probe.holdText} className="tp-value" />
        </Row>
        <Row>
          <fast-div className="tp-slider" onMouseDown={() => probe.armRelease(() => `${sliderRef.current}%`)}>
            <Slider
              value={slider}
              onChange={(value) => {
                sliderRef.current = value
                setSlider(value)
              }}
            />
          </fast-div>
          <TextBlock text={sliderText} className="tp-value" />
        </Row>
        <Row>
          <div ref={inputRef} className="tp-input">
            <TextInput
              value={text}
              placeholder="type here"
              onChange={(value) => {
                textRef.current = value
                setText(value)
              }}
            />
          </div>
          <TextBlock text={text} className="tp-value" />
        </Row>
        <Row>
          <Checkbox checked={checked} label="checkbox" onChange={guard('checkbox', (value: boolean) => {
            setChecked(value)
            log('button', `checkbox ${value}`)
          })} />
        </Row>
        <Row>
          <Dropdown
            options={DROPDOWN_OPTIONS}
            value={choice}
            placeholder="dropdown"
            onChange={(value) => {
              setChoice(value)
              log('button', `dropdown ${value}`)
            }}
          />
        </Row>
        <Row>
          <RadioGroup
            options={RADIO_OPTIONS}
            value={radio}
            onChange={(value) => {
              setRadio(value)
              log('button', `radio ${value}`)
            }}
          />
        </Row>
        <Row>
          <div className="tp-progress">
            <ProgressBar value={slider} />
          </div>
        </Row>
        <Row>
          <Tooltip content="Tooltip text">
            <Button>tooltip</Button>
          </Tooltip>
        </Row>
        <Row>
          <Button
            onPress={guard('throw', () => {
              setTimeout(() => {
                throw new Error('test error from setTimeout')
              }, 0)
              log('button', 'scheduled throw')
            })}
          >
            throw
          </Button>
          <Button
            onPress={guard('promise reject', () => {
              Promise.reject(new Error('test rejection'))
              log('button', 'rejected a promise')
            })}
          >
            promise reject
          </Button>
          <Button onPress={guard('engine info', engineInfo)}>engine info</Button>
          <Button onPress={guard('clear log', probe.clear)}>clear log</Button>
        </Row>
        <Row>
          <Button onPress={guard('open modal', () => setModalOpen(true))}>open modal</Button>
          <Button onPress={guard('toast', () => toasts.show({ text: 'toast from the probe', timeout: 3000 }))}>toast</Button>
        </Row>
      </Section>
    </div>
  )
}
