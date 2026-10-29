import { useEffect, useRef } from 'react'
import { useFacetState } from '@react-facet/core'
import type { Probe } from './probe'
import type { Skin } from './skins'
import { Row, Section } from './parts'

const AUDIO_EVENTS = ['loadedmetadata', 'playing', 'ended', 'error']

type ImageProbeProps = { src: string; label: string; className?: string; probe: Probe }

const ImageProbe = ({ src, label, className, probe }: ImageProbeProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const [status, setStatus] = useFacetState(`${label}: waiting`)

  useEffect(() => {
    const img = ref.current
    if (!img) return
    const report = (event: string) => () => {
      setStatus(`${label}: ${event}`)
      probe.log('media', `${label} ${event}`)
    }
    const onLoad = report('load')
    const onError = report('error')
    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
    img.src = src
    return () => {
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }
  }, [src, label, probe, setStatus])

  return (
    <div className="tp-media">
      <img ref={ref} className={className ? `tp-img ${className}` : 'tp-img'} />
      <fast-div className="tp-small">
        <fast-text text={status} />
      </fast-div>
    </div>
  )
}

export const Media = ({ skin, probe }: { skin: Skin; probe: Probe }) => {
  const { Button } = skin
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioStatus, setAudioStatus] = useFacetState('audio: -')

  useEffect(
    () => () => {
      audioRef.current?.remove()
      audioRef.current = null
    },
    [],
  )

  const beep = () => {
    let audio = audioRef.current
    if (!audio) {
      const created = document.createElement('audio')
      AUDIO_EVENTS.forEach((name) =>
        created.addEventListener(name, () => {
          setAudioStatus(`audio: ${name}${created.error ? ` error=${created.error.code}` : ''}`)
          probe.log('media', `audio ${name}`)
        }),
      )
      created.src = '/hbui/media/beep.wav'
      document.body.appendChild(created)
      audioRef.current = created
      audio = created
    }
    audio.currentTime = 0
    const played = audio.play()
    if (played && played.then) played.then(undefined, (err) => probe.log('media', `audio play rejected ${err}`))
  }

  return (
    <Section title="Media">
      <Row>
        <ImageProbe src="/hbui/media/spin.gif" label="gif" probe={probe} />
        <ImageProbe src="pack://textures/items/diamond_sword.png?filtering=point" label="pack://" probe={probe} />
        <ImageProbe src="geo-item://diamond_sword?width=64&height=64" label="geo-item://" probe={probe} />
        <ImageProbe src="/hbui/media/spin.gif" label="css spin" className="tp-spin" probe={probe} />
      </Row>
      <Row>
        <Button onPress={probe.guard('beep', beep)}>beep (audio)</Button>
        <fast-div className="tp-small">
          <fast-text text={audioStatus} />
        </fast-div>
      </Row>
    </Section>
  )
}
