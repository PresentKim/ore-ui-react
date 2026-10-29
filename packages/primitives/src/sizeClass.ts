import { useEffect } from 'react'
import { Facet, useFacetState } from '@react-facet/core'

export type SizeClass = 's' | 'm' | 'l'

export const guiSize = (size: number | string): string =>
  typeof size === 'string' ? size : `${Number((size * 0.2).toFixed(4))}rem`

export const sizeClassOf = (widthRem: number): SizeClass => (widthRem >= 100 ? 'l' : widthRem >= 64 ? 'm' : 's')

const currentSizeClass = (): SizeClass => {
  const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
  return sizeClassOf(window.innerWidth / rem)
}

export const useSizeClass = (): Facet<SizeClass> => {
  const [sizeClass, setSizeClass] = useFacetState<SizeClass>(currentSizeClass())

  useEffect(() => {
    const update = () => setSizeClass(currentSizeClass())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [setSizeClass])

  return sizeClass
}
