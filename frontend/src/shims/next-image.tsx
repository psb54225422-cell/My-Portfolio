import type { CSSProperties, ImgHTMLAttributes } from 'react'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  unoptimized?: boolean
  priority?: boolean
  src: string
  alt: string
}

export default function Image({ fill, style, src, alt, ...props }: ImageProps) {
  const resolvedStyle: CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }
    : style

  return <img src={src} alt={alt} style={resolvedStyle} {...props} />
}