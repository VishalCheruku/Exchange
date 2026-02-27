// Lightweight, pluggable semantic + visual search mock.
// Replace `computeTextScore` and `computeImageScore` with real embedding calls when available.

const tokenize = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

const jaccard = (a, b) => {
  const setA = new Set(a)
  const setB = new Set(b)
  const inter = [...setA].filter((x) => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size || 1
  return inter / union
}

const computeTextScore = (query, item) => {
  if (!query) return 0
  const qTokens = tokenize(query)
  const hay = tokenize(`${item.title || ''} ${item.description || ''} ${item.category || ''}`)
  return jaccard(qTokens, hay)
}

// Visual similarity mock: if imageUrlHint matches exactly, return 1; otherwise small bonus.
const computeImageScore = (imageUrlHint, item) => {
  if (!imageUrlHint) return 0
  if (item.imageUrl && item.imageUrl === imageUrlHint) return 1
  if (item.imageUrl && imageUrlHint && item.imageUrl.includes(imageUrlHint.slice(0, 20))) return 0.6
  return 0.1
}

export const semanticRank = (items, { queryText = '', imageUrlHint = '' } = {}) => {
  const scored = (items || []).map((item) => {
    const textScore = computeTextScore(queryText, item)
    const imageScore = computeImageScore(imageUrlHint, item)
    const score = textScore * 0.7 + imageScore * 0.3
    return { item, score }
  })
  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || (b.item.createAt || '').localeCompare(a.item.createAt || ''))
}

export default semanticRank
