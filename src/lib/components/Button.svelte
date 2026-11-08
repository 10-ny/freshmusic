<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    'aria-label'?: string;
    'aria-expanded'?: boolean | 'true' | 'false';
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    children,
    onclick,
    ...rest
  }: Props = $props();

  const base =
    'inline-flex items-center gap-2 rounded-md font-medium leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed';

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-[14px] py-2 text-[14px]',
    lg: 'px-5 py-2.5 text-[15px]',
  };

  const variants: Record<string, string> = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-focus',
    secondary:
      'bg-surface-1 text-ink border border-hairline hover:bg-surface-2 hover:border-hairline-strong',
    tertiary:
      'bg-transparent text-ink-subtle hover:text-ink',
    inverse:
      'bg-white text-[var(--color-inverse-ink)] hover:bg-[var(--color-inverse-surface-2)] active:bg-[var(--color-inverse-surface-1)]',
  };

  const cls = $derived([base, sizes[size], variants[variant]].join(' '));
</script>

{#if href}
  <a {href} class={cls} {...rest}>{@render children()}</a>
{:else}
  <button {type} {disabled} class={cls} {onclick} {...rest}>{@render children()}</button>
{/if}
