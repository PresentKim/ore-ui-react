import type { CSSProperties, ReactNode } from 'react'
import { useFacetMap, useFacetWrap } from '@react-facet/core'
import type { FacetProp } from '@react-facet/core'

export type ImageOptions = {
  repeat?: 'both' | 'x' | 'y'
  size?: string
  position?: string
}

export type ImageProps = {
  src: FacetProp<string>
  fill?: boolean
  options?: ImageOptions
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const repeatOf = (repeat?: ImageOptions['repeat']) => {
  if (repeat === 'both') return 'repeat'
  if (repeat === 'x') return 'repeat-x'
  if (repeat === 'y') return 'repeat-y'
  return 'no-repeat'
}

const positionOf = (position?: string) => {
  if (!position) return undefined
  return /^(top|bottom)$/.test(position) ? `center ${position}` : position
}

const classOf = (base: string, className?: string) => (className ? `${base} ${className}` : base)

const sizeOf = (fill?: boolean, options?: ImageOptions): CSSProperties => {
  if (fill) return { width: '100%', height: '100%' }
  if (options) return {}
  return { width: '3.5rem', height: '3.5rem' }
}

export const Image = ({ src, fill, options, className, style, children }: ImageProps) => {
  const srcFacet = useFacetWrap(src)
  const backgroundImage = useFacetMap((url) => `url("${url}")`, [], [srcFacet])
  const size = options?.size ?? (options ? undefined : 'contain')
  const look: CSSProperties = {
    backgroundRepeat: repeatOf(options?.repeat),
    backgroundPosition: positionOf(options?.position) ?? (options ? undefined : 'center'),
    backgroundSize: size,
    ...sizeOf(fill, options),
    ...style,
  }

  return (
    <fast-div className={classOf('ou-image', className)} style={{ ...look, backgroundImage }}>
      {children}
    </fast-div>
  )
}

export const MaskImage = ({ src, fill, options, className, style, children }: ImageProps) => {
  const srcFacet = useFacetWrap(src)
  const maskImage = useFacetMap((url) => `url("${url}")`, [], [srcFacet])
  const look: Record<string, string | undefined> = {
    maskRepeat: repeatOf(options?.repeat),
    maskSize: options?.size,
    maskPosition: positionOf(options?.position),
    WebkitMaskRepeat: repeatOf(options?.repeat),
    WebkitMaskSize: options?.size,
    WebkitMaskPosition: positionOf(options?.position),
    ...(fill ? { width: '100%', height: '100%' } : {}),
    ...(style as Record<string, string>),
  }

  return (
    <fast-div
      className={classOf('ou-mask-image', className)}
      style={{ ...(look as CSSProperties), maskImage, WebkitMaskImage: maskImage }}
    >
      {children}
    </fast-div>
  )
}
