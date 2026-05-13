import type { AnchorHTMLAttributes, MouseEvent } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  replace?: boolean
}

function navigate(href: string, replace?: boolean) {
  if (replace) {
    window.history.replaceState({}, '', href)
  } else {
    window.history.pushState({}, '', href)
  }
  window.dispatchEvent(new Event('app:navigation'))
}

export default function Link({ href, onClick, replace, target, children, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    navigate(href, replace)
  }

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}