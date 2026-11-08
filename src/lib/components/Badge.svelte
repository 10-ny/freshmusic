<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    tone?: 'neutral' | 'success' | 'brand';
    dot?: boolean;
    children: Snippet;
  }

  let { tone = 'neutral', dot = false, children }: Props = $props();

  const tones: Record<string, string> = {
    neutral: 'bg-surface-2 text-ink-subtle',
    success: 'bg-surface-2 text-[var(--color-success-ink)]',
    brand:   'bg-surface-2 text-[var(--color-primary-ink)]',
  };

  const dots: Record<string, string> = {
    neutral: 'bg-ink-subtle',
    success: 'bg-[var(--color-success)]',
    brand:   'bg-primary',
  };
</script>

<span
  class="inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-[12px] font-medium leading-[1.4] {tones[tone]}"
>
  {#if dot}
    <span class="size-1.5 rounded-full {dots[tone]}" aria-hidden="true"></span>
  {/if}
  {@render children()}
</span>
