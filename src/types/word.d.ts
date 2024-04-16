export type word = {
  cet4_distortion:string,
  cet4_phonetic: string,
  cet4_phrase: string,
  cet4_samples: string,
  cet4_translate: string,
  cet4_word: string,
  id: number
}

export type word_sample_filter = {
    cet4_distortion: string,
    cet4_phonetic: string,
    cet4_phrase: string,
    cet4_samples: string[], // 将 cet4_samples 改为字符串数组类型
    cet4_translate: string,
    cet4_word: string,
    id: number
}