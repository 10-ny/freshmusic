<script lang="ts">
  import type { PageProps } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import Button from '#lib/components/Button.svelte';
  import { formatDate } from '#lib/data/albums';

  let { data }: PageProps = $props();
  const albums = $derived(data.albums);

  let selected = $state(0);
  const n = $derived(albums.length);

  function go(k: number) {
    selected = ((k % n) + n) % n;
  }

  function pad(k: number) {
    return String(k + 1).padStart(2, '0');
  }

  type Slide = {
    tx: number;
    sc: number;
    op: number;
    z: number;
    gray: number;
    isSelected: boolean;
  };

  const slides = $derived(
    albums.map((_: unknown, k: number) => {
      let off = k - selected;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      const abs = Math.abs(off);
      return {
        tx: off * 0.92,
        sc: abs === 0 ? 1 : abs === 1 ? 0.72 : 0.55,
        op: abs === 0 ? 1 : abs === 1 ? 0.5 : abs === 2 ? 0.18 : 0,
        z: 10 - abs,
        gray: abs === 0 ? 0 : 0.6,
        isSelected: abs === 0,
      } satisfies Slide;
    })
  );

  const current = $derived(albums[selected]);

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(selected - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(selected + 1); }
  }

  let dragStart = $state<number | null>(null);

  function onPointerDown(e: PointerEvent) {
    dragStart = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: PointerEvent) {
    if (dragStart === null) return;
    const dx = e.clientX - dragStart;
    dragStart = null;
    if (Math.abs(dx) > 40) go(selected + (dx < 0 ? 1 : -1));
  }
</script>

<svelte:head>
  <title>New releases — FreshMusic</title>
</svelte:head>

<main
  style="--card: clamp(240px, 30vw, 440px)"
  class="relative flex flex-1 flex-col overflow-hidden"
>
  <!-- Giant background index -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute left-8 top-6 select-none font-semibold leading-none text-surface-3"
    style="font-size: clamp(120px, 18vw, 260px); letter-spacing: -0.04em; z-index:0"
  >
    {pad(selected)}
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="relative flex-1"
    style="min-height: calc(var(--card) + 80px)"
    role="group"
    aria-roledescription="carousel"
    aria-label="Latest albums from artists you follow"
    tabindex="0"
    onkeydown={onKeydown}
    onpointerdown={onPointerDown}
    onpointerup={onPointerUp}
  >
    {#each albums as album, k}
      {@const s = slides[k]}
      <button
        type="button"
        onclick={() => go(k)}
        aria-label="{album.artist} — {album.title}{s.isSelected ? ' (selected)' : ''}"
        class="absolute overflow-hidden border border-hairline bg-surface-1 p-0 motion-safe:transition-[transform,opacity,filter] motion-safe:duration-[600ms] motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        style="
          left:50%; top:50%;
          width:var(--card); height:var(--card);
          margin-top: calc(var(--card) / -2);
          margin-left: calc(var(--card) / -2);
          border-radius: var(--radius-xl);
          transform: translateX(calc(var(--card) * {s.tx})) scale({s.sc});
          opacity:{s.op};
          z-index:{s.z};
          filter: grayscale({s.gray});
          cursor: {s.isSelected ? 'default' : 'pointer'};
        "
      >
        {#if album.cover}
          <img
            src={album.cover}
            alt=""
            class="block h-full w-full object-cover"
            aria-hidden="true"
          />
        {:else}
          <div class="flex h-full w-full items-center justify-center bg-surface-1">
            <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
              <rect width="400" height="400" fill="var(--color-surface-1)" />
              <circle cx="200" cy="200" r="150" fill="var(--color-surface-3)" />
              <circle cx="200" cy="200" r="96" fill="var(--color-surface-1)" />
              <circle cx="200" cy="200" r="40" fill="var(--color-surface-4)" />
            </svg>
          </div>
        {/if}

        {#if album.isNew}
          <span class="absolute left-4 top-4">
            <Badge tone="brand" dot>New</Badge>
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Caption + controls -->
  <div class="relative z-10 flex flex-wrap items-end gap-6 px-8 pb-10" style="gap: 24px 48px">
    <!-- Caption -->
    <div class="min-w-0 flex-1" style="flex-basis: 420px">
      <h1
        class="t-display-lg m-0"
        style="font-size: clamp(36px, 5vw, 56px)"
      >
        {current.title}
      </h1>
      <div
        class="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-hairline pt-4"
        style="max-width:680px; gap: 12px 32px"
      >
        <div class="flex min-w-0 flex-col gap-1">
          <span class="t-body-lg font-medium text-ink">{current.artist}</span>
          <span class="t-body-sm text-ink-subtle">
            Produced by <span class="text-ink-muted">{current.producer}</span>
          </span>
        </div>
        <div class="flex flex-col items-end gap-1 text-right">
          <span class="t-eyebrow text-ink-subtle" style="font-size:11px">Released</span>
          <span class="t-mono text-ink" style="font-size:15px">{formatDate(current.releaseDate)}</span>
        </div>
      </div>
      <div class="mt-6">
        <Button href="/album/{current.slug}" variant="primary" size="md">
          View album
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </Button>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col items-end gap-4" style="flex: 0 1 auto">
      <!-- Progress segments -->
      <div class="flex items-center gap-2">
        {#each albums as album, k}
          <button
            type="button"
            onclick={() => go(k)}
            aria-label="{album.artist} — {album.title}"
            class="flex h-11 w-11 cursor-pointer items-center border-0 bg-transparent p-0"
          >
            <span
              class="block h-0.5 w-full rounded-sm"
              style="background: {k === selected ? 'var(--color-primary)' : 'var(--color-hairline-strong)'}"
            ></span>
          </button>
        {/each}
      </div>
      <!-- Counter + prev/next -->
      <div class="flex items-center gap-4">
        <span class="t-mono text-ink-subtle">
          <span class="text-ink">{pad(selected)}</span> / {pad(n - 1)}
        </span>
        <button
          type="button"
          onclick={() => go(selected - 1)}
          aria-label="Previous album"
          class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-hairline bg-surface-1 text-ink transition-colors hover:bg-surface-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onclick={() => go(selected + 1)}
          aria-label="Next album"
          class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-hairline bg-surface-1 text-ink transition-colors hover:bg-surface-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</main>
