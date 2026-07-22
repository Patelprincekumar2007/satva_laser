/* ═══════════════════════════════════════════════════════
   SATVA LASER — WhatsApp Integration
   ═══════════════════════════════════════════════════════ */

const WA_NUMBER = '919909430941';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

export function waLink(message) {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  window.open(waLink(message), '_blank');
}

export function buildProductInquiry(productName, category, finish) {
  return `Hi Satva Laser! 👋

I'm interested in the *${productName}*${category ? ` (${category})` : ''}${finish ? ` in *${finish}* finish` : ''}.

Could you please share:
• Pricing details
• Available sizes & customization options
• Estimated delivery timeline

Looking forward to your response!`;
}

export function buildDemoRequest(productName) {
  return `Hi Satva Laser! 👋

I'd like to request a *demo/viewing* for the *${productName}*.

Please share:
• Available time slots
• Studio visit details
• Any samples available

Thank you!`;
}

export function buildCartInquiry(cartItems) {
  let itemList = cartItems.map((item, i) =>
    `${i + 1}. *${item.name}*${item.finish ? ` — ${item.finish} finish` : ''} × ${item.qty}`
  ).join('\n');

  return `Hi Satva Laser! 👋

I'd like to inquire about the following items:

${itemList}

Could you please share:
• Pricing for each item
• Bulk/combo pricing if available
• Estimated delivery timeline
• Customization options

Looking forward to your response!`;
}

export function buildGeneralInquiry() {
  return `Hi Satva Laser! 👋

I'm interested in your laser cutting services. Could you please share details about:
• Available products & services
• Pricing
• Custom order process

Thank you!`;
}

export function buildServiceInquiry(serviceName) {
  return `Hi Satva Laser! 👋

I'd like to inquire about your *${serviceName}* service.

Could you please share:
• Service details & capabilities
• Pricing structure
• Turnaround time
• Material requirements

Thank you!`;
}
