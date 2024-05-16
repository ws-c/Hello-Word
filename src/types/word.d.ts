export type word = {
  distortion: string
  phonetic: string
  phrase: string
  samples: string
  translate: string
  word: string
  id: number
}

export type word_sample_filter = {
  distortion: string
  phonetic: string
  phrase: string[]
  samples: string[]
  translate: string[]
  word: string
  id: number
}
