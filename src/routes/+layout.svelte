<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Button from '#lib/components/Button.svelte';
  import type { Snippet } from 'svelte';

  const USER_ID_KEY = 'rotation-user-id';

  let { children }: { children: Snippet } = $props();

  const isWelcome = $derived(page.url.pathname === '/welcome');
  const isSetup = $derived(page.url.pathname === '/setup');
  const isReleases = $derived(page.url.pathname === '/releases');
  const isArtists = $derived(page.url.pathname === '/artists');

  let signOutOpen = $state(false);
  let copied = $state(false);
  let userId = $state('');

  $effect(() => {
    const stored = localStorage.getItem(USER_ID_KEY);
    if (!isWelcome && !isSetup && !stored) {
      goto('/welcome');
    }
    userId = stored ?? '';
  });

  function openSignOut() {
    signOutOpen = true;
    copied = false;
  }

  function closeSignOut() {
    signOutOpen = false;
  }

  function copyId() {
    try { navigator.clipboard.writeText(userId); } catch {}
    copied = true;
  }

  function confirmSignOut() {
    signOutOpen = false;
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem('rotation-followed-artists');
    goto('/welcome');
  }

  function onDialogKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeSignOut();
  }
</script>

{#if isWelcome || isSetup}
  {@render children()}
{:else}
  <div class="flex min-h-screen flex-col bg-canvas text-ink">

    <!-- Header -->
    <header class="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-hairline px-8 py-5">
      <a href="/releases" class="flex items-center gap-2.5 text-ink">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <rect width="22" height="22" rx="6" fill="#5e6ad2" />
          <circle cx="11" cy="11" r="6" fill="none" stroke="#ffffff" stroke-width="1.6" />
          <circle cx="11" cy="11" r="1.6" fill="#ffffff" />
        </svg>
        <span style="font-size:16px;font-weight:600;letter-spacing:-0.3px">FreshMusic</span>
      </a>

      <nav aria-label="Main" class="flex flex-1 justify-center gap-7">
        <a
          href="/releases"
          aria-current={isReleases ? 'page' : undefined}
          class="inline-flex items-center px-1 text-[16px] font-medium"
          style="min-height:44px;letter-spacing:-0.2px;color:{isReleases ? 'var(--color-ink)' : 'var(--color-ink-subtle)'}"
        >
          New releases
        </a>
        <a
          href="/artists"
          aria-current={isArtists ? 'page' : undefined}
          class="inline-flex items-center px-1 text-[16px] font-medium"
          style="min-height:44px;letter-spacing:-0.2px;color:{isArtists ? 'var(--color-ink)' : 'var(--color-ink-subtle)'}"
        >
          Artists
        </a>
      </nav>

      <button
        type="button"
        onclick={openSignOut}
        class="inline-flex items-center border-0 bg-transparent px-1 text-[16px] font-medium text-ink-subtle transition-colors hover:text-ink"
        style="min-height:44px;letter-spacing:-0.2px;cursor:pointer;font-family:var(--font-text)"
      >
        Sign out
      </button>
    </header>

    {@render children()}
  </div>

  <!-- Sign-out dialog -->
  {#if signOutOpen}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      role="presentation"
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
      onkeydown={onDialogKeydown}
    >
      <button
        type="button"
        aria-label="Cancel"
        onclick={closeSignOut}
        class="absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
        style="background:rgba(0,0,0,0.7)"
      ></button>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="so-title"
        class="relative w-full max-w-[420px] border border-hairline-strong p-7 box-border"
        style="border-radius:var(--radius-lg);background:var(--color-surface-1)"
      >
        <h2 id="so-title" class="t-headline m-0" style="font-size:24px">Keep your user ID</h2>
        <p class="t-body m-0 mt-2 text-ink-subtle">
          There's no password. You'll need this ID to sign back in and see your artists, so save it somewhere safe before you go.
        </p>

        <div
          class="mt-5 flex items-center gap-3 border border-hairline px-4 py-3"
          style="border-radius:var(--radius-md);background:var(--color-canvas)"
        >
          <span class="t-mono flex-1 text-ink" style="font-size:18px;letter-spacing:0.5px">{userId}</span>
          <Button variant="secondary" size="sm" onclick={copyId}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <div class="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="tertiary" size="lg" onclick={closeSignOut}>
            Cancel
          </Button>
          <button
            type="button"
            onclick={confirmSignOut}
            class="inline-flex items-center px-[18px] text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover"
            style="min-height:44px;border-radius:var(--radius-md);background:var(--color-primary);border:0;cursor:pointer;font-family:var(--font-text)"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}
