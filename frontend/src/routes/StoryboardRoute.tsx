import { useEffect, useState } from 'react'
import { WorkGrid } from '@/components/work-grid'
import type { Storyboard } from '@/lib/types'

export default function StoryboardRoute() {
  const [items, setItems] = useState<Storyboard[]>([])

  useEffect(() => {
    let active = true
    fetch('/api/works?type=storyboard')
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
      title="Storyboards"
      subtitle="Visual Narratives & Sequences"
      basePath="/storyboard"
      emptyMessage="No storyboards yet"
    />
  )
}