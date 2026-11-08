**Input** — the Linear marketing form field (contact sales, signup). Surface-1 fill, hairline border, 8px corners; focus keeps the surface and adds a 2px lavender-focus ring at 50% opacity.

```jsx
<Input label="Work email" type="email" placeholder="you@company.com" />
<Input as="textarea" label="How can we help?" hint="We reply within a day." />
```

Set `invalid` for error styling. Pass `value`/`onChange` to control it.
