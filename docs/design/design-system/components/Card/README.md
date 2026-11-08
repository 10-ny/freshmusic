**Card** — the Linear marketing surface card. Depth comes from surface lift + 1px hairline + a faint white top-edge highlight — never a drop shadow, never a colored left-border, never a gradient or lavender fill.

```jsx
<Card variant="feature">
  <h3 className="t-card-title">Issue tracking</h3>
  <p className="t-body-sm" style={{ color: 'var(--color-ink-subtle)' }}>Track work across your team.</p>
</Card>
```

Variants: `feature` · `pricing` · `pricing-featured` (surface-2 lift) · `product-screenshot` (16px corners — frames an app capture) · `testimonial` (32px pad) · `cta-banner` (48px pad). Set `interactive` to lift on hover.
