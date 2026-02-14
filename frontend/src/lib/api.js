export function getMediaUrl(path) {
  if (!path) return ''
  return path
}

export function normalizeWhatsAppNumber(number = '') {
  return number.replace(/\D/g, '')
}

export function getFallbackWhatsAppNumber() {
  return normalizeWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER || '')
}

export function getWhatsAppUrl(message = '', number = '') {
  const normalizedNumber = normalizeWhatsAppNumber(number) || getFallbackWhatsAppNumber()
  if (!normalizedNumber) return ''

  const text = message.trim()
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${normalizedNumber}${query}`
}
