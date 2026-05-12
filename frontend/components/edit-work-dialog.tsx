'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function EditWorkDialog({ item, type }: { item: any, type: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(item.title || '')
  const [description, setDescription] = useState(item.description || '')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          id: item.id,
          updateData: { title, description }
        })
      })
      if (!res.ok) throw new Error('Update failed')
      setIsOpen(false)
      router.refresh()
    } catch (e) {
      alert('수정 실패')
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/works?type=${type}&id=${item.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Delete failed')
      setIsOpen(false)
      router.refresh()
    } catch (e) {
      alert('삭제 실패')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true) }}
          className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground p-2 rounded-md shadow transition-colors z-20"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>수정 / 삭제</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>제목</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>설명</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={isDeleting}>
              삭제
            </Button>
            <Button className="flex-1" onClick={handleUpdate}>
              수정 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
