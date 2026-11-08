<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Button from '#lib/components/Button.svelte';
  import type { Snippet } from 'svelte';

  const USER_ID_KEY = 'rotation-user-id';

  let { children }: { children: Snippet } = $props();

  const isWelcome = $derived(page.url.pathname === '/welcome');
  const isHome = $derived(page.url.pathname === '/');

  $effect(() => {
    if (!isWelcome && !localStorage.getItem(USER_ID_KEY)) {
      goto('/welcome');
    }
  });
</script>

{#if isWelcome}
  {@render children()}
{:else}
  <div class="flex min-h-screen flex-col bg-canvas text-ink">
    <header class="relative z-10 flex items-center gap-6 border-b border-hairline px-8 py-5">
      <a href="/" class="flex items-center gap-2.5 text-ink">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <rect width="22" height="22" rx="6" fill="#5e6ad2" />
          <circle cx="11" cy="11" r="6" fill="none" stroke="#ffffff" stroke-width="1.6" />
          <circle cx="11" cy="11" r="1.6" fill="#ffffff" />
        </svg>
        <span style="font-size:16px;font-weight:600;letter-spacing:-0.3px">Rotation</span>
      </a>

      {#if isHome}
        <span class="t-eyebrow text-ink-subtle" style="font-size:11px">New releases</span>
      {:else}
        <a
          href="/"
          class="inline-flex items-center gap-1.5 text-[14px] text-ink-subtle hover:text-ink"
          style="min-height:44px"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
          New releases
        </a>
      {/if}

      <div class="ml-auto">
        <!-- TODO: open menu -->
        <Button variant="secondary" size="md" aria-label="Open menu" aria-expanded="false">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M2.5 5h11M2.5 11h11" />
          </svg>
          Menu
        </Button>
      </div>
    </header>

    {@render children()}
  </div>
{/if}
