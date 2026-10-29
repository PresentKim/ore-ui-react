import type { Probe } from './probe'
import type { Skin } from './skins'
import { Pre, Section } from './parts'

export const Stats = ({ skin, probe }: { skin: Skin; probe: Probe }) => {
  const { Scroll } = skin

  return (
    <div className="tp-stats">
      <Section title="Page">
        <Pre text={probe.stats} />
      </Section>
      <Section title="Mouse">
        <Pre text={probe.mouse} />
      </Section>
      <Section title="Keys held">
        <Pre text={probe.keys} />
      </Section>
      <Section title="Gamepads">
        <Pre text={probe.pads} />
      </Section>
      <Section title="Event counts">
        <Pre text={probe.counts} />
      </Section>
      <Section title="Log (newest first)">
        <div className="tp-log">
          <Scroll>
            <Pre text={probe.logText} className="tp-log-text" />
          </Scroll>
        </div>
      </Section>
    </div>
  )
}
