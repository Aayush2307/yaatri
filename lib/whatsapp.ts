const FALLBACK_MEERA_WHATSAPP_NUMBER = '918153026157';

function normalizeWhatsAppNumber(input?: string): string {
  const digits = (input || '').replace(/\D/g, '');
  return digits || FALLBACK_MEERA_WHATSAPP_NUMBER;
}

export function getMeeraWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_MEERA_WHATSAPP_NUMBER;
  const normalized = normalizeWhatsAppNumber(raw);
  return normalized || FALLBACK_MEERA_WHATSAPP_NUMBER;
}

export function buildMeeraWhatsAppUrl(message: string): string {
  const number = getMeeraWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openMeeraWhatsApp(message: string) {
  const whatsappUrl = buildMeeraWhatsAppUrl(message);
  if (process.env.NODE_ENV === 'development') {
    console.log('Opening WhatsApp:', whatsappUrl);
  }
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export { FALLBACK_MEERA_WHATSAPP_NUMBER };
