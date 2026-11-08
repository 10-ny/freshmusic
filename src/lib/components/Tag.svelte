<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    mono?: boolean;
    children: Snippet;
  }

  let { mono = false, children }: Props = $props();
</script>

<span
  class="inline-flex items-center rounded-sm border border-hairline bg-surface-1 px-2 py-0.5 text-[12px] leading-[1.4] text-ink-subtle {mono ? 'font-mono' : ''}"
>
  {@render children()}
</span>
