<script lang="ts">
  import type { PageProps } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import Tag from '#lib/components/Tag.svelte';

  let { data }: PageProps = $props();
  const album  = $derived(data.album);
  const tracks = $derived(data.tracks);

  let coverLoaded = $state(false);

  function formatDate(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function pad(k: number) {
    return String(k).padStart(2, '0');
  }

  function formatDuration(ms: number): string {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
</script>

<svelte:head>
  <title>{album.title} — {album.artist} · FreshMusic</title>
</svelte:head>

<main class="mx-auto w-full max-w-[1280px] px-8 py-16 pb-24 box-border">
  <div class="flex flex-wrap items-start gap-16">

    <!-- Left column -->
    <div class="flex min-w-0 flex-col gap-8" style="flex: 1 1 480px">
      <figure class="m-0">
        <div class="relative aspect-square overflow-hidden border border-hairline bg-surface-1" style="border-radius: var(--radius-xl)">
          {#if album.coverUrl}
            <img
              src={album.coverUrl}
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
          <span>{album.artist}</span>
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
          </div>
          <div class="flex flex-col items-end gap-1 text-right">
            <span class="t-eyebrow text-ink-subtle" style="font-size:11px">Released</span>
            <span class="t-mono text-ink" style="font-size:15px">{formatDate(album.releaseDate)}</span>
          </div>
        </div>

        <dl class="mt-6 flex flex-wrap gap-4" style="gap: 16px 40px">
          <div>
            <dt class="t-caption text-ink-subtle">Tracks</dt>
            <dd class="mt-1 text-[14px] text-ink-muted">{album.totalTracks}</dd>
          </div>
        </dl>
      </section>
    </div>

    <!-- Right column: tracklist -->
    <div class="min-w-0" style="flex: 1 1 380px">
      <section aria-labelledby="tracklist-heading">
        <h2 id="tracklist-heading" class="t-eyebrow m-0 mb-3 text-ink-subtle">Tracklist</h2>
        <ol class="m-0 list-none border-t border-hairline p-0">
          {#each tracks as track}
            <li class="flex items-center gap-4 border-b border-hairline py-2.5 text-[14px]">
              <span class="t-mono w-6 shrink-0 text-ink-subtle">{pad(track.number)}</span>
              <span class="flex-1 text-ink">{track.name}</span>
              <span class="t-mono shrink-0 text-ink-subtle">{formatDuration(track.durationMs)}</span>
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
