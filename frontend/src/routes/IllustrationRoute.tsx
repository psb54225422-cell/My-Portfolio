import { useEffect, useState } from 'react'
import { IllustrationGrid } from '@/components/illustration-grid'
import type { Illustration } from '@/lib/types'

export default function IllustrationRoute() {
  const [items, setItems] = useState<Illustration[]>([])

  useEffect(() => {
    let active = true
    fetch('/api/works?type=illustration')
      .then((response) => response.json())
      .then((data) => {
        if (active) setItems(data.items || [])
      })
      .catch(() => {
        if (active) setItems([])
      })
    return () => {
      active = false
    }
  }, [])

  return <IllustrationGrid illustrations={items} />
}