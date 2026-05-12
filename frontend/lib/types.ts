export interface Profile {
  id: string
  profile_image_url: string | null
  artist_name?: string | null
  short_description?: string | null
  description: string | null
  career: string | null
  sns_links: SNSLink[]
  created_at: string
  updated_at: string
}

export interface SNSLink {
  platform: string
  url: string
  icon?: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string | null
  created_at: string
  updated_at: string
}

export interface Illustration {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  images: string[]
  created_at: string
  updated_at: string
}

export interface Comic {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  pages: string[]
  created_at: string
  updated_at: string
}

export interface Storyboard {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  pages: string[]
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  content_type: 'illustration' | 'comic' | 'storyboard'
  content_id: string
  author_name: string
  comment_text: string
  created_at: string
}

export interface GuestbookEntry {
  id: string
  image_url: string
  page_number: number
  created_at: string
}
