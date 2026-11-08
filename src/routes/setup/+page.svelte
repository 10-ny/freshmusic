<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '#lib/components/Button.svelte';
  import Input from '#lib/components/Input.svelte';
  import Avatar from '#lib/components/Avatar.svelte';

  const FOLLOWED_KEY = 'rotation-followed-artists';

  const ALL_ARTISTS = [
    'Kendrick Lamar', 'Nas', 'JAY-Z', 'OutKast', 'A Tribe Called Quest',
    'MF DOOM', 'Madlib', 'J. Cole', 'Little Simz', 'Tyler, the Creator',
    'Mos Def', 'Common', 'Lauryn Hill', 'Wu-Tang Clan', 'Run the Jewels',
    'Denzel Curry',
  ];

  let query = $state('');
  let picked = $state<string[]>([]);

  const searching = $derived(query.trim().length >= 3);
  const q = $derived(query.trim().toLowerCase());
  const results = $derived(
    searching ? ALL_ARTISTS.filter((n) => n.toLowerCase().includes(q)) : []
  );
  const noResults = $derived(searching && results.length === 0);

  function toggle(name: string) {
    picked = picked.includes(name)
      ? picked.filter((p) => p !== name)
      : [...picked, name];
  }

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

  function finish() {
    localStorage.setItem(FOLLOWED_KEY, JSON.stringify(picked));
    goto('/');
  }

  function skip() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Pick your artists — Rotation</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-canvas text-ink">

  <!-- Header -->
  <header class="flex items-center gap-4 border-b border-hairline px-8 py-5">
    <span class="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect width="22" height="22" rx="6" fill="#5e6ad2" />
        <circle cx="11" cy="11" r="6" fill="none" stroke="#ffffff" stroke-width="1.6" />
        <circle cx="11" cy="11" r="1.6" fill="#ffffff" />
      </svg>
      <span style="font-size:16px;font-weight:600;letter-spacing:-0.3px">FreshMusic</span>
    </span>
    <span class="t-mono ml-auto text-ink-subtle">Setup · 1 of 1</span>
  </header>

  <!-- Content -->
  <main class="mx-auto w-full max-w-[1040px] flex-1 px-8 pb-40 pt-16 box-border">

    <p class="t-eyebrow m-0 mb-4 text-[var(--color-primary-ink)]">Get started</p>
    <h1 class="t-display-md m-0" style="font-size: clamp(32px, 5vw, 40px)">
      Pick the artists you follow
    </h1>
    <p class="t-body-lg m-0 mt-3 max-w-[560px] text-ink-subtle">
      We'll show their latest albums first and flag anything new. You can change this any time.
    </p>

    <!-- Search -->
    <div class="mx-auto mt-10 max-w-[480px]">
      <Input
        label="Search artists"
        type="search"
        placeholder="Artist name"
        bind:value={query}
        hint="Type at least 3 letters"
      />
    </div>

    <!-- Results grid -->
    <section aria-label="Search results" class="mt-6">
      {#if searching}
        {#if noResults}
          <p class="t-body m-0 text-ink-subtle">No artists match "{query.trim()}".</p>
        {:else}
          <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
            {#each results as artist}
              {@const on = picked.includes(artist)}
              <button
                type="button"
                onclick={() => toggle(artist)}
                aria-pressed={on}
                aria-label={on ? `Remove ${artist}` : `Add ${artist}`}
                class="artist-card relative flex cursor-pointer flex-col gap-2.5 rounded-lg border p-2.5 text-left font-[inherit] text-ink transition-colors duration-150"
                style="background:{on ? 'var(--color-surface-2)' : 'var(--color-surface-1)'};border-color:{on ? 'var(--color-primary)' : 'var(--color-hairline)'}"
              >
                <!-- Avatar / photo placeholder -->
                <span class="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-surface-3">
                  <span class="font-semibold text-ink-subtle" style="font-size:36px;letter-spacing:-1px">
                    {initials(artist)}
                  </span>
                  <span class="t-mono absolute left-2 top-1.5 text-ink-subtle" style="font-size:10px">
                    Artist photo
                  </span>
                  <span class="artist-name absolute inset-x-0 bottom-0 overflow-hidden text-ellipsis whitespace-nowrap px-2.5 pb-2.5 pt-6 text-[14px] font-medium text-ink"
                    style="background:linear-gradient(0deg,rgba(1,1,2,0.85) 0%,rgba(1,1,2,0) 100%)">
                    {artist}
                  </span>
                </span>

                <!-- Check indicator -->
                <span
                  aria-hidden="true"
                  class="absolute right-4 top-4 flex h-[22px] w-[22px] items-center justify-center rounded-full border"
                  style="background:{on ? 'var(--color-primary)' : 'rgba(1,1,2,0.6)'};border-color:{on ? 'var(--color-primary)' : 'var(--color-hairline-strong)'}"
                >
                  {#if on}
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M11.5 4 L6 9.5 L3 6.5" />
                    </svg>
                  {/if}
                </span>
              </button>
            {/each}
          </div>
        {/if}
      {/if}
    </section>

    <!-- Picked artists -->
    {#if picked.length > 0}
      <section aria-labelledby="picked-heading" class="mt-10">
        <h2 id="picked-heading" class="t-eyebrow m-0 mb-3 text-ink-subtle">Your artists</h2>
        <div class="flex flex-wrap gap-2">
          {#each picked as artist}
            <button
              type="button"
              onclick={() => toggle(artist)}
              aria-label="Remove {artist}"
              class="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-pill border border-hairline bg-surface-1 py-1 pl-1 pr-3 text-[14px] text-ink transition-colors hover:border-hairline-strong"
            >
              <Avatar name={artist} size={32} />
              {artist}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--color-ink-subtle)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          {/each}
        </div>
      </section>
    {/if}

  </main>

  <!-- Sticky action bar -->
  <div class="sticky bottom-0 border-t border-hairline" style="background:rgba(1,1,2,0.92);backdrop-filter:blur(12px)">
    <div class="mx-auto flex max-w-[1040px] flex-wrap items-center gap-3 px-8 py-4 box-border" style="gap: 12px 16px">
      <span role="status" class="t-body-sm text-ink-muted">
        <span class="t-mono text-ink">{picked.length}</span>
        {picked.length === 0 ? ' selected · pick at least one to continue' : ' selected · you can add more later'}
      </span>
      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          onclick={skip}
          class="inline-flex min-h-[44px] cursor-pointer items-center px-[14px] text-[14px] font-medium text-ink-subtle transition-colors hover:text-ink"
        >
          Skip for now
        </button>
        <Button variant="primary" size="lg" disabled={picked.length === 0} onclick={finish}>
          Show my releases
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </Button>
      </div>
    </div>
  </div>

</div>

<style>
  .artist-name {
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 150ms ease, transform 150ms ease;
  }

  .artist-card:hover .artist-name,
  .artist-card:focus-visible .artist-name {
    opacity: 1;
    transform: none;
  }

  @media (hover: none) {
    .artist-name {
      opacity: 1;
      transform: none;
    }
  }
</style>
