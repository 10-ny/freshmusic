**Button** — the Linear marketing CTA; compact, 8px corners, never pill-rounded. Use the lavender `primary` scarcely (one per section); `secondary` for "Sign in"-type actions, `tertiary` for low-emphasis text actions.

```jsx
<Button variant="primary">Get started</Button>
<Button variant="secondary">Sign in</Button>
<Button variant="tertiary">Read the changelog</Button>
```

Variants: `primary` (lavender fill) · `secondary` (surface-1 + hairline) · `tertiary` (plain text) · `inverse` (white-on-dark, rare). Sizes `sm | md | lg`. Pass `iconLeft` / `iconRight` for icons, `disabled` to mute.
