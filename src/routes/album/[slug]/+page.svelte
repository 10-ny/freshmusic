<script lang="ts">
  import type { PageProps } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import Tag from '#lib/components/Tag.svelte';
  import { formatDate } from '#lib/data/albums';

  let { data }: PageProps = $props();
  const album = $derived(data.album);
  const index = $derived(data.index);
  const total = $derived(data.total);

  let coverLoaded = $state(false);

  function pad(k: number) {
    return String(k + 1).padStart(2, '0');
  }
</script>

<svelte:head>
  <title>{album.title} — {album.artist} · Rotation</title>
</svelte:head>

<main class="mx-auto w-full max-w-[1280px] px-8 py-16 pb-24 box-border">
  <div class="flex flex-wrap items-start gap-16">

    <!-- Left column -->
    <div class="flex min-w-0 flex-col gap-8" style="flex: 1 1 480px">
      <figure class="m-0">
        <div class="relative aspect-square overflow-hidden border border-hairline bg-surface-1" style="border-radius: var(--radius-xl)">
          {#if album.cover}
            <img
              src={album.cover}
              alt="Cover of {album.title}"
              class="block h-full w-full object-cover"
              class:reveal={!coverLoaded}
              onload={() => (coverLoaded = true)}
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
        </div>
        <figcaption class="t-mono mt-3 flex justify-between text-ink-subtle" style="font-size:11px">
          <span>{pad(index)} / {pad(total - 1)}</span>
          <span>Cover</span>
        </figcaption>
      </figure>

      <section>
        <div class="mb-4 flex items-center gap-2.5">
          {#if album.isNew}
            <Badge tone="brand" dot>New</Badge>
          {/if}
          <Tag>Album</Tag>
        </div>

        <h1 class="t-display-lg m-0" style="font-size: clamp(40px, 5vw, 56px)">
          {album.title}
        </h1>

        <div
          class="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-hairline pt-4"
          style="gap: 12px 32px"
        >
          <div class="flex flex-col gap-1">
            <span class="t-body-lg font-medium text-ink">{album.artist}</span>
            <span class="t-body-sm text-ink-subtle">
              Produced by <span class="text-ink-muted">{album.producer}</span>
            </span>
          </div>
          <div class="flex flex-col items-end gap-1 text-right">
            <span class="t-eyebrow text-ink-subtle" style="font-size:11px">Released</span>
            <span class="t-mono text-ink" style="font-size:15px">{formatDate(album.releaseDate)}</span>
          </div>
        </div>

        {#if album.label}
          <dl class="mt-6 flex flex-wrap gap-4" style="gap: 16px 40px">
            <div>
              <dt class="t-caption text-ink-subtle">Label</dt>
              <dd class="mt-1 text-[14px] text-ink-muted">{album.label}</dd>
            </div>
            <div>
              <dt class="t-caption text-ink-subtle">Tracks</dt>
              <dd class="mt-1 text-[14px] text-ink-muted">{album.tracks.length}</dd>
            </div>
          </dl>
        {/if}
      </section>
    </div>

    <!-- Right column -->
    <div class="min-w-0" style="flex: 1 1 380px">
      <section aria-labelledby="tracklist-heading">
        <h2 id="tracklist-heading" class="t-eyebrow m-0 mb-3 text-ink-subtle">Tracklist</h2>
        <ol class="m-0 list-none border-t border-hairline p-0">
          {#each album.tracks as track, k}
            <li class="flex items-center gap-4 border-b border-hairline py-2.5 text-[14px]">
              <span class="t-mono w-6 text-ink-subtle">{pad(k)}</span>
              <span class="text-ink">{track}</span>
            </li>
          {/each}
        </ol>
      </section>
    </div>

  </div>
</main>

<style>
  .reveal {
    opacity: 0;
    transform: scale(1.04);
    animation: reveal 1200ms cubic-bezier(0.22, 1, 0.36, 1) 150ms forwards;
  }

  @keyframes reveal {
    to { opacity: 1; transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
