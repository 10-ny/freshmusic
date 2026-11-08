<script lang="ts">
  import { goto } from '$app/navigation';
  import Badge from '#lib/components/Badge.svelte';
  import { albums } from '#lib/data/albums';

  const FOLLOWED_KEY = 'rotation-followed-artists';

  function initials(name: string) {
    return name
      .replace(/[^A-Za-z ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  let followed = $state<string[]>([]);

  $effect(() => {
    try {
      followed = JSON.parse(localStorage.getItem(FOLLOWED_KEY) ?? '[]');
    } catch {
      followed = [];
    }
  });

  function unfollow(name: string) {
    followed = followed.filter((a) => a !== name);
    localStorage.setItem(FOLLOWED_KEY, JSON.stringify(followed));
  }

  const artistCards = $derived(
    followed.map((name) => {
      const latestAlbum = albums
        .filter((a: typeof albums[number]) => a.artist === name)
        .sort((a: typeof albums[number], b: typeof albums[number]) => b.releaseDate.localeCompare(a.releaseDate))[0];
      return {
        name,
        initials: initials(name),
        latest: latestAlbum?.title ?? '—',
        year: latestAlbum?.releaseDate.slice(0, 4) ?? '',
        isNew: latestAlbum?.isNew ?? false,
      };
    })
  );
</script>

<svelte:head>
  <title>Your artists — FreshMusic</title>
</svelte:head>

<main class="mx-auto w-full max-w-[1280px] flex-1 px-8 pb-24 pt-16 box-border">
  <div class="flex flex-wrap items-end justify-between gap-6">
    <div>
      <h1 class="t-display-md m-0" style="font-size: clamp(32px, 5vw, 40px)">Your artists</h1>
      <p class="t-body-lg m-0 mt-2 text-ink-subtle">
        You follow <span class="t-mono text-ink">{followed.length}</span> artists. New albums from them show up first.
      </p>
    </div>
    <a
      href="/setup"
      class="inline-flex items-center gap-2 px-[18px] text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover"
      style="min-height:44px;border-radius:var(--radius-md);background:var(--color-primary)"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <path d="M8 3v10M3 8h10" />
      </svg>
      Add artists
    </a>
  </div>

  {#if followed.length === 0}
    <div class="mt-16 flex flex-col items-center gap-4 text-center">
      <p class="t-body-lg m-0 text-ink-subtle">You're not following anyone yet.</p>
      <a
        href="/setup"
        class="inline-flex items-center gap-2 px-[18px] text-[15px] font-medium text-on-primary"
        style="min-height:44px;border-radius:var(--radius-md);background:var(--color-primary)"
      >
        Find artists to follow
      </a>
    </div>
  {:else}
    <div
      class="mt-10 grid gap-4"
      style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))"
    >
      {#each artistCards as artist}
        <article
          class="flex flex-col overflow-hidden border border-hairline bg-surface-1"
          style="border-radius:var(--radius-lg)"
        >
          <!-- Photo placeholder -->
          <div
            class="relative flex aspect-square items-center justify-center bg-surface-3"
          >
            <span
              class="font-semibold text-ink-subtle"
              style="font-family:var(--font-display);font-size:48px;letter-spacing:-1.5px"
            >
              {artist.initials}
            </span>
            <span class="t-mono absolute left-2.5 top-2 text-ink-subtle" style="font-size:10px">
              Artist photo
            </span>
            {#if artist.isNew}
              <span class="absolute right-2.5 top-2.5">
                <Badge tone="brand" dot>New album</Badge>
              </span>
            {/if}
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-1 px-4 pb-4 pt-3.5">
            <h2 class="t-card-title m-0" style="font-size:18px">{artist.name}</h2>
            <span class="t-body-sm text-ink-subtle">
              Latest: <span class="text-ink-muted">{artist.latest}</span>
              {#if artist.year}
                · <span class="t-mono">{artist.year}</span>
              {/if}
            </span>
            <div class="mt-3 flex gap-2">
              <a
                href="/releases"
                class="inline-flex flex-1 items-center justify-center border border-hairline bg-surface-2 text-[13px] font-medium text-ink transition-colors hover:bg-surface-3"
                style="min-height:40px;border-radius:var(--radius-md)"
              >
                Discography
              </a>
              <button
                type="button"
                onclick={() => unfollow(artist.name)}
                aria-label="Unfollow {artist.name}"
                class="cursor-pointer border border-hairline bg-transparent px-3 text-[13px] font-medium text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink"
                style="min-height:40px;border-radius:var(--radius-md);font-family:var(--font-text)"
              >
                Unfollow
              </button>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</main>
