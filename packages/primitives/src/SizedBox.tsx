import type { CSSProperties, ReactNode } from 'react'
import { guiSize } from './sizeClass'
import './primitives.css'

export type SizedBoxProps = {
  width?: number | string
  height?: number | string
  maxWidth?: string
  maxHeight?: string
  fixed?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export const SizedBox = ({
  width,
  height,
  maxWidth = '96vw',
  maxHeight = '96vh',
  fixed,
  className,
  style,
  children,
}: SizedBoxProps) => {
  const size: CSSProperties = { maxWidth, maxHeight }
  if (width !== undefined) size.width = guiSize(width)
  if (height !== undefined) size.height = guiSize(height)
  if (fixed) size.flexShrink = 0

  return (
    <fast-div className={className ? `ou-sized ${className}` : 'ou-sized'} style={{ ...size, ...style }}>
      {children}
    </fast-div>
  )
}
