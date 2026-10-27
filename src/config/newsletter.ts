// Mailchimp signup configuration — single source of truth.
//
// Get these values from Mailchimp:
// Audience > Signup forms > Embedded forms > copy the <form action="..."> URL
// Example: https://yourname.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY&f_id=ZZZZ
// `honeypotName` is the hidden "b_XXXX_YYYY" field name from the embed code.
//
// Both the newsletter popup and the inline newsletter section use these values,
// so there is only one place to update when the audience changes.
export const NEWSLETTER = {
  actionUrl:
    "https://laboutiquedellago.us8.list-manage.com/subscribe/post?u=417495efca0bb0fe790ed2a57&id=83185ab70e&f_id=0078d7e1f0",
  honeypotName: "b_417495efca0bb0fe790ed2a57_83185ab70e",
  privacyUrl: "/privacy",
  // Percentuale di sconto di benvenuto mostrata nel popup.
  // Sostituire "X" con il valore confermato dal cliente (es. "10").
  discountPercent: "X",
} as const;
