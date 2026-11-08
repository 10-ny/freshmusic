/* @ds-bundle: {"format":4,"namespace":"LinearMarketingDesignSystem_868804","components":[{"name":"Button"},{"name":"Card"},{"name":"Badge"},{"name":"Tag"},{"name":"Avatar"},{"name":"Input"},{"name":"PricingTabs"}]} */
(() => {
const __ds_ns = (window.LinearMarketingDesignSystem_868804 = window.LinearMarketingDesignSystem_868804 || {});
__ds_ns.__errors = __ds_ns.__errors || [];
const h = (...a) => React.createElement(...a);

/* Avatar — circular avatar for testimonial cards. Image if `src`, else initials on a surface-2 disc. */
function Avatar({ src = null, name = '', size = 36, style = {}, ...rest }) {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return h('span', Object.assign({
    title: name || undefined,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface-2)', border: '1px solid var(--color-hairline)',
      color: 'var(--color-ink-muted)', fontFamily: 'var(--font-text)',
      fontSize: Math.round(size * 0.38), fontWeight: 'var(--weight-medium)',
      overflow: 'hidden', flexShrink: 0, ...style
    }
  }, rest), src ? h('img', { src, alt: name, style: { width: '100%', height: '100%', objectFit: 'cover' } }) : initials);
}

/* Badge — small status pill. tone: neutral | success | brand. */
function Badge({ tone = 'neutral', dot = false, children, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: 'var(--color-surface-2)', color: 'var(--color-ink-muted)', dot: 'var(--color-ink-subtle)' },
    success: { bg: 'rgba(39, 166, 68, 0.12)', color: 'var(--color-success-ink)', dot: 'var(--color-success)' },
    brand: { bg: 'rgba(94, 106, 210, 0.14)', color: 'var(--color-primary-ink)', dot: 'var(--color-primary)' }
  };
  const t = tones[tone] || tones.neutral;
  return h('span', Object.assign({
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bg, color: t.color,
      fontFamily: 'var(--font-text)', fontSize: 'var(--caption-size)', fontWeight: 'var(--weight-medium)',
      lineHeight: 'var(--caption-lh)', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap', ...style
    }
  }, rest), dot && h('span', { style: { width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 } }), children);
}

/* Button — compact CTA: 8px/14px padding, 8px corners, 14px medium label. */
function Button({ variant = 'primary', size = 'md', type = 'button', disabled = false, iconLeft = null, iconRight = null, href, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = { sm: { padding: '6px 12px', fontSize: 13 }, md: { padding: '8px 14px', fontSize: 14 }, lg: { padding: '10px 18px', fontSize: 15 } };
  const palettes = {
    primary: { bg: 'var(--color-primary)', bgHover: 'var(--color-primary-hover)', bgActive: 'var(--color-primary-focus)', color: 'var(--color-on-primary)', border: '1px solid transparent' },
    secondary: { bg: 'var(--color-surface-1)', bgHover: 'var(--color-surface-2)', bgActive: 'var(--color-surface-1)', color: 'var(--color-ink)', border: '1px solid var(--color-hairline)' },
    tertiary: { bg: 'transparent', bgHover: 'var(--color-surface-1)', bgActive: 'transparent', color: 'var(--color-ink)', border: '1px solid transparent' },
    inverse: { bg: 'var(--color-inverse-canvas)', bgHover: 'var(--color-inverse-surface-2)', bgActive: 'var(--color-inverse-surface-1)', color: 'var(--color-inverse-ink)', border: '1px solid transparent' }
  };
  const p = palettes[variant] || palettes.primary;
  const s = sizes[size] || sizes.md;
  const bg = disabled ? 'var(--color-surface-1)' : active ? p.bgActive : hover ? p.bgHover : p.bg;
  const El = href ? 'a' : 'button';
  return h(El, Object.assign({}, href ? { href } : { type, disabled }, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setActive(false); },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--font-text)', fontSize: s.fontSize, fontWeight: 'var(--weight-medium)',
      lineHeight: 'var(--button-lh)', letterSpacing: 'var(--button-ls)', padding: s.padding,
      borderRadius: 'var(--radius-md)', border: p.border, background: bg,
      color: disabled ? 'var(--color-ink-tertiary)' : p.color,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1,
      transition: 'background 150ms ease, color 150ms ease', whiteSpace: 'nowrap',
      userSelect: 'none', textDecoration: 'none', boxSizing: 'border-box', ...style
    }
  }, rest), iconLeft, children, iconRight);
}

/* Card — surface fill + 1px hairline + corners + faint white top-edge highlight. No shadow. */
function Card({ variant = 'feature', interactive = false, edgeHighlight = true, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    feature: { bg: 'var(--color-surface-1)', radius: 'var(--radius-lg)', pad: 'var(--pad-card)', border: 'var(--color-hairline)' },
    pricing: { bg: 'var(--color-surface-1)', radius: 'var(--radius-lg)', pad: 'var(--pad-card)', border: 'var(--color-hairline)' },
    'pricing-featured': { bg: 'var(--color-surface-2)', radius: 'var(--radius-lg)', pad: 'var(--pad-card)', border: 'var(--color-hairline-strong)' },
    'product-screenshot': { bg: 'var(--color-surface-1)', radius: 'var(--radius-xl)', pad: 'var(--pad-card)', border: 'var(--color-hairline)' },
    testimonial: { bg: 'var(--color-surface-1)', radius: 'var(--radius-lg)', pad: 'var(--pad-testimonial)', border: 'var(--color-hairline)' },
    'cta-banner': { bg: 'var(--color-surface-1)', radius: 'var(--radius-lg)', pad: 'var(--pad-banner)', border: 'var(--color-hairline)' }
  };
  const v = variants[variant] || variants.feature;
  const bg = interactive && hover ? 'var(--color-surface-2)' : v.bg;
  const border = interactive && hover ? 'var(--color-hairline-strong)' : v.border;
  return h('div', Object.assign({
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    style: {
      position: 'relative', background: bg, border: `1px solid ${border}`, borderRadius: v.radius,
      padding: v.pad, color: 'var(--color-ink)', fontFamily: 'var(--font-text)',
      transition: 'background 150ms ease, border-color 150ms ease', ...style
    }
  }, rest), edgeHighlight && h('span', {
    style: { position: 'absolute', insetInline: 0, top: 0, height: 1, background: 'var(--edge-highlight)', borderRadius: `${v.radius} ${v.radius} 0 0`, pointerEvents: 'none' }
  }), children);
}

/* Tag — small inline chip. Surface-1 fill, hairline border, 6px corners. */
function Tag({ children, mono = false, style = {}, ...rest }) {
  return h('span', Object.assign({
    style: {
      display: 'inline-flex', alignItems: 'center', background: 'var(--color-surface-1)',
      border: '1px solid var(--color-hairline)', color: 'var(--color-ink-muted)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-text)', fontSize: 'var(--caption-size)',
      fontWeight: 'var(--weight-medium)', lineHeight: 1.4, padding: '3px 8px',
      borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', ...style
    }
  }, rest), children);
}

/* Input — surface-1 fill, hairline border, 8px corners; focus adds the lavender ring. */
function Input({ as = 'input', label = null, hint = null, invalid = false, style = {}, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const fieldStyle = {
    width: '100%', boxSizing: 'border-box', background: 'var(--color-surface-1)', color: 'var(--color-ink)',
    fontFamily: 'var(--font-text)', fontSize: 'var(--body-size)', lineHeight: 'var(--body-lh)',
    padding: as === 'textarea' ? '10px 12px' : '8px 12px', minHeight: as === 'textarea' ? 96 : 40,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${invalid ? 'var(--color-success)' : focus ? 'var(--color-hairline-strong)' : 'var(--color-hairline)'}`,
    boxShadow: focus ? 'var(--focus-ring)' : 'none', outline: 'none',
    resize: as === 'textarea' ? 'vertical' : undefined,
    transition: 'border-color 150ms ease, box-shadow 150ms ease', ...style
  };
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    label && h('label', { htmlFor: fieldId, style: { fontFamily: 'var(--font-text)', fontSize: 'var(--body-sm-size)', fontWeight: 'var(--weight-medium)', color: 'var(--color-ink-muted)' } }, label),
    h(as, Object.assign({ id: fieldId, onFocus: () => setFocus(true), onBlur: () => setFocus(false), style: fieldStyle }, rest)),
    hint && h('span', { style: { fontFamily: 'var(--font-text)', fontSize: 'var(--caption-size)', color: 'var(--color-ink-tertiary)' } }, hint));
}

/* PricingTabs — pill toggle. Selected = surface-2 + ink; default = transparent + ink-subtle. */
function PricingTabs({ tabs = [], value, defaultValue, onChange, style = {} }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const selected = value !== undefined ? value : internal;
  const select = v => { if (value === undefined) setInternal(v); onChange && onChange(v); };
  return h('div', {
    role: 'tablist',
    style: { display: 'inline-flex', gap: 4, padding: 4, background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-pill)', ...style }
  }, tabs.map(t => {
    const v = t.value ?? t;
    const label = t.label ?? t;
    const on = v === selected;
    return h('button', {
      key: v, role: 'tab', 'aria-selected': on, onClick: () => select(v),
      style: {
        border: 'none', cursor: 'pointer', fontFamily: 'var(--font-text)', fontSize: 'var(--body-sm-size)',
        fontWeight: 'var(--weight-medium)', letterSpacing: '-0.05px', padding: '6px 14px', minHeight: 36,
        borderRadius: 'var(--radius-pill)', background: on ? 'var(--color-surface-2)' : 'transparent',
        color: on ? 'var(--color-ink)' : 'var(--color-ink-subtle)',
        transition: 'background 150ms ease, color 150ms ease', whiteSpace: 'nowrap'
      }
    }, label);
  }));
}

Object.assign(__ds_ns, { Button, Card, Badge, Tag, Avatar, Input, PricingTabs });
})();
