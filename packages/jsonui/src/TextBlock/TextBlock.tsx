import type { TextBlockProps } from '@ore-ui-react/core/src/textblock'
import './textblock.css'

const classOf = (inline: boolean, variant: string, className?: string) => {
  const base = `jui-textblock${inline ? ' jui-textblock-inline' : ''} jui-textblock-${variant}`
  return className ? `${base} ${className}` : base
}

export const TextBlock = ({ text, children, variant = 'body', className, style }: TextBlockProps) => (
  <fast-div className={classOf(false, variant, className)} style={{ ...style }}>
    {text === undefined ? children : <fast-text text={text} />}
  </fast-div>
)

export const InlineTextBlock = ({ text, children, variant = 'body', className, style }: TextBlockProps) => (
  <fast-span className={classOf(true, variant, className)} style={{ ...style }}>
    {text === undefined ? children : <fast-text text={text} />}
  </fast-span>
)
