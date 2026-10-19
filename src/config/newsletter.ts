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
  actionUrl: "https://CLIENT.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY&f_id=ZZZZ",
  honeypotName: "b_XXXX_YYYY",
  privacyUrl: "/privacy",
} as const;
