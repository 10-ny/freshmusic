<script lang="ts">
  interface Props {
    name?: string;
    src?: string | null;
    size?: number;
  }

  let { name = '', src = null, size = 36 }: Props = $props();

  const initials = $derived(
    name
      .replace(/[^A-Za-z ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  );
</script>

<span
  class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2"
  style="width:{size}px;height:{size}px;font-size:{Math.round(size * 0.38)}px"
  aria-hidden="true"
>
  {#if src}
    <img {src} alt="" class="h-full w-full object-cover" />
  {:else}
    <span class="font-medium text-ink-subtle">{initials}</span>
  {/if}
</span>
