import type { CSSProperties } from 'react'
import type { BoxProps } from './Box'

type Offset = number | string

type Offsets = {
  top?: Offset
  left?: Offset
  right?: Offset
  bottom?: Offset
}

type Axes = { x?: number; y?: number; z?: number }

type TransformSpec = {
  translate?: Axes
  rotate?: Axes
  scale?: Axes
  skew?: Pick<Axes, 'x' | 'y'>
}

export type AbsoluteProps = BoxProps & Offsets & { center?: boolean | 'x' | 'y' }
export type RelativeProps = BoxProps & Offsets
export type TransformProps = BoxProps &
  TransformSpec & {
    matrix?: TransformSpec
    origin?: string | { x?: string; y?: string; z?: string }
  }
export type Layout3DProps = BoxProps & { distance?: number | string }

const AXES = ['x', 'y', 'z'] as const

const offsetOf = (value: Offset) => (typeof value === 'number' ? `${value}rem` : value)

const insetOf = ({ top, left, right, bottom }: Offsets): CSSProperties => {
  const inset: CSSProperties = {}
  if (top !== undefined) inset.top = offsetOf(top)
  if (left !== undefined) inset.left = offsetOf(left)
  if (right !== undefined) inset.right = offsetOf(right)
  if (bottom !== undefined) inset.bottom = offsetOf(bottom)
  return inset
}

const classOf = (base: string, className?: string) => (className ? `${base} ${className}` : base)

export const Absolute = ({ top, left, right, bottom, center, className, style, children }: AbsoluteProps) => {
  const placed: CSSProperties = { position: 'absolute', ...insetOf({ top, left, right, bottom }) }
  const centerX = center === true || center === 'x'
  const centerY = center === true || center === 'y'
  if (centerX) placed.left = '50%'
  if (centerY) placed.top = '50%'
  if (centerX && centerY) placed.transform = 'translate(-50%, -50%)'
  else if (centerX) placed.transform = 'translateX(-50%)'
  else if (centerY) placed.transform = 'translateY(-50%)'

  return (
    <fast-div className={classOf('ou-absolute', className)} style={{ ...placed, ...style }}>
      {children}
    </fast-div>
  )
}

export const Relative = ({ top, left, right, bottom, className, style, children }: RelativeProps) => (
  <fast-div
    className={classOf('ou-relative', className)}
    style={{ position: 'relative', ...insetOf({ top, left, right, bottom }), ...style }}
  >
    {children}
  </fast-div>
)

const transformOf = ({ translate, rotate, scale, skew }: TransformSpec): string => {
  const parts: string[] = []
  AXES.forEach((axis) => {
    const value = translate?.[axis]
    if (value !== undefined) parts.push(`translate${axis.toUpperCase()}(${value}px)`)
  })
  AXES.forEach((axis) => {
    const value = rotate?.[axis]
    if (value !== undefined) parts.push(`rotate${axis.toUpperCase()}(${value}deg)`)
  })
  AXES.forEach((axis) => {
    const value = scale?.[axis]
    if (value !== undefined) parts.push(`scale${axis.toUpperCase()}(${value})`)
  })
  ;(['x', 'y'] as const).forEach((axis) => {
    const value = skew?.[axis]
    if (value !== undefined) parts.push(`skew${axis.toUpperCase()}(${value}deg)`)
  })
  return parts.join(' ')
}

const originOf = (origin: TransformProps['origin']): string | undefined =>
  typeof origin === 'object' ? [origin.x ?? '50%', origin.y ?? '50%', origin.z].filter(Boolean).join(' ') : origin

export const Transform = ({
  translate,
  rotate,
  scale,
  skew,
  matrix,
  origin,
  className,
  style,
  children,
}: TransformProps) => {
  const transform = transformOf(matrix ?? { translate, rotate, scale, skew })
  const transformStyle: CSSProperties = {}
  if (transform) transformStyle.transform = transform
  const transformOrigin = originOf(origin)
  if (transformOrigin) transformStyle.transformOrigin = transformOrigin

  return (
    <fast-div className={classOf('ou-transform', className)} style={{ ...transformStyle, ...style }}>
      {children}
    </fast-div>
  )
}

export const Layout3D = ({ distance, className, style, children }: Layout3DProps) => (
  <fast-div
    className={classOf('ou-layout3d', className)}
    style={{
      ...(distance === undefined ? {} : { perspective: typeof distance === 'number' ? `${distance}px` : distance }),
      ...style,
    }}
  >
    {children}
  </fast-div>
)
