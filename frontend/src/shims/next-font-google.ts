type FontOptions = {
  subsets?: string[]
  weight?: string[]
  variable?: string
}

function createFont(options: FontOptions = {}) {
  return {
    variable: options.variable || '',
  }
}

export const Noto_Serif_KR = createFont
export const Noto_Sans_KR = createFont