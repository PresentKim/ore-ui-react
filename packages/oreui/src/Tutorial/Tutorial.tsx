import { Layer } from '@ore-ui-react/core/src/layer'
import { useTutorial } from '@ore-ui-react/core/src/tutorial'
import type { TutorialProps } from '@ore-ui-react/core/src/tutorial'
import { Button } from '../Button/Button'
import './tutorial.css'

export const Tutorial = (props: TutorialProps) => {
  const { cardRef, current, layout, isFirst, isLast, back, next } = useTutorial(props)
  if (!current) return null
  const { highlight, card } = layout ?? { highlight: null, card: { x: 0, y: 0 } }

  return (
    <Layer>
      <div className="oui-tutorial">
        {highlight && (
          <div
            className="oui-tutorial-highlight"
            style={{ left: `${highlight.x}px`, top: `${highlight.y}px`, width: `${highlight.w}px`, height: `${highlight.h}px` }}
          />
        )}
        <div
          ref={cardRef}
          className="oui-tutorial-card"
          style={{ left: `${card.x}px`, top: `${card.y}px`, visibility: layout ? 'visible' : 'hidden' }}
        >
          <div className="oui-tutorial-title">{current.title}</div>
          <div className="oui-tutorial-content">{current.content}</div>
          <div className="oui-tutorial-actions">
            <Button disabled={isFirst} onPress={back}>
              Back
            </Button>
            <Button variant="primary" onPress={next}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </Layer>
  )
}
