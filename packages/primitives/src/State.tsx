import { Children, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Mount, useFacetMap, useFacetWrap } from '@react-facet/core'
import type { FacetProp } from '@react-facet/core'

export type MatchProps = {
  name: string
  children?: ReactNode
}

export type StateProps = {
  value: FacetProp<string>
  children?: ReactNode
}

export const Match = ({ children }: MatchProps) => <>{children}</>

const MatchMount = ({ name, names, value, children }: MatchProps & { names: string[]; value: FacetProp<string> }) => {
  const valueFacet = useFacetWrap(value)
  const active = useFacetMap(
    (current) => (name === '' ? !names.includes(current) : current === name),
    [name, names],
    [valueFacet],
  )

  return <Mount when={active}>
      <>{children}</>
    </Mount>
}

export const State = ({ value, children }: StateProps) => {
  const matches = Children.toArray(children).filter(
    (child): child is ReactElement<MatchProps> => isValidElement(child) && child.type === Match,
  )
  const names = matches.filter((match) => match.props.name !== '').map((match) => match.props.name)

  return (
    <>
      {matches.map((match) => (
        <MatchMount key={match.key} name={match.props.name} names={names} value={value}>
          {match.props.children}
        </MatchMount>
      ))}
    </>
  )
}
