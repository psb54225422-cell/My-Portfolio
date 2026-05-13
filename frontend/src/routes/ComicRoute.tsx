import { useEffect, useState } from 'react'
import { WorkGrid } from '@/components/work-grid'
import type { Comic } from '@/lib/types'

export default function ComicRoute() {
  const [items, setItems] = useState<Comic[]>([])

  useEffect(() => {
    let active = true
    fetch('/api/works?type=comic')
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

  return (
    <WorkGrid
      items={items}
      title="Comics"
      subtitle="Sequential Art & Stories"
      basePath="/comic"
      emptyMessage="No comics yet"
    />
  )
}