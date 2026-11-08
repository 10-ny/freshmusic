**PricingTabs** — the pill-toggle from `/pricing` (e.g. Monthly / Yearly). The selected tab is a surface-2 lift with full ink; deselected tabs are ink-subtle on canvas. Controlled or uncontrolled.

```jsx
<PricingTabs
  tabs={[{ label: 'Monthly', value: 'm' }, { label: 'Yearly', value: 'y' }]}
  defaultValue="m"
  onChange={(v) => setBilling(v)}
/>
```
