export function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

export function safeUrl(str) {
  if (typeof str !== 'string' || !str) return null;
  try {
    const parsed = new URL(str);
    return ['http:', 'https:'].includes(parsed.protocol) ? str : null;
  } catch {
    return null;
  }
}
