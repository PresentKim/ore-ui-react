import type { ReactNode } from 'react'
import type { FacetProp } from '@react-facet/core'
import { useFacetWrap } from '@react-facet/core'

export const Section = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="tp-section">
    <div className="tp-section-title">{title}</div>
    {children}
  </div>
)

export const Row = ({ children }: { children?: ReactNode }) => <div className="tp-row">{children}</div>

export const Pre = ({ text, className }: { text: FacetProp<string>; className?: string }) => {
  const facet = useFacetWrap(text)
  return (
    <fast-div className={className ? `tp-pre ${className}` : 'tp-pre'}>
      <fast-text text={facet} />
    </fast-div>
  )
}
