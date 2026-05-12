'use client'

import { useState, useRef } from 'react'
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

interface AddWorkDialogProps {
  type: 'comic' | 'storyboard' | 'illustration'
}

export function AddWorkDialog({ type }: AddWorkDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pagesInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()

  const handleUpload = async () => {
    if (!title || !fileInputRef.current?.files?.length) {
      alert('제목과 표지(또는 대표) 파일을 선택해주세요.')
      return
    }

    setIsUploading(true)
    try {
      const file = fileInputRef.current.files[0]
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()

      let pageUrls: string[] = []
      if ((type === 'comic' || type === 'storyboard') && pagesInputRef.current?.files) {
        for (let i = 0; i < pagesInputRef.current.files.length; i++) {
          const pageFile = pagesInputRef.current.files[i]
          const pageFormData = new FormData()
          pageFormData.append('file', pageFile)
          const pageRes = await fetch('/api/upload', { method: 'POST', body: pageFormData })
          if (!pageRes.ok) throw new Error('Page upload failed')
          const { url: pageUrl } = await pageRes.json()
          pageUrls.push(pageUrl)
        }
      }

      const insertData: any = {
        id: Date.now().toString(),
        title,
        description,
        created_at: new Date().toISOString()
      }
      
      if (type === 'illustration') {
        insertData.image_url = url
        insertData.thumbnail_url = url
      } else {
        insertData.cover_url = url
        insertData.pages = pageUrls
      }

      const saveRes = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, insertData })
      })

      if (!saveRes.ok) throw new Error('Save failed')
      
      setIsOpen(false)
      setTitle('')
      setDescription('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      alert('업로드가 완료되었습니다.')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const titleLabels = {
    comic: '만화',
    storyboard: '스토리보드',
    illustration: '일러스트'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6 z-20 shadow-md flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          새 {titleLabels[type]} 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 {titleLabels[type]} 업로드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>제목</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="제목을 입력하세요" 
            />
          </div>
          <div className="space-y-2">
            <Label>설명 (선택)</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="작품 설명을 입력하세요" 
              rows={3} 
            />
          </div>
          <div className="space-y-2">
            <Label>{type === 'illustration' ? '대표 이미지' : '썸네일(표지) 이미지'}</Label>
            <Input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
            />
          </div>
          {type !== 'illustration' && (
            <div className="space-y-2">
              <Label>만화/스토리보드 원고 (여러 장 선택 가능)</Label>
              <Input 
                type="file" 
                accept="image/*" 
                multiple
                ref={pagesInputRef} 
              />
            </div>
          )}
          <Button 
            className="w-full mt-4" 
            onClick={handleUpload} 
            disabled={isUploading}
          >
            {isUploading ? '저장 중...' : '변경사항 저장 완료'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
