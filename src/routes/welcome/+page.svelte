<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '#lib/components/Button.svelte';
  import Input from '#lib/components/Input.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import { words } from '#lib/data/wordlist';

  const USER_ID_KEY = 'rotation-user-id';

  function generate(): string {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    return `${words[buf[0] % words.length]}-${words[buf[1] % words.length]}`;
  }

  let userId = $state('');
  let justCreated = $state(false);
  let error = $state('');
  let loading = $state(false);

  function onCreate() {
    userId = generate();
    justCreated = true;
    error = '';
  }

  function onInput(e: Event & { currentTarget: HTMLInputElement }) {
    userId = e.currentTarget.value;
    justCreated = false;
    error = '';
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const trimmed = userId.trim();
    if (!trimmed) {
      error = 'Please enter or create a user ID.';
      return;
    }
    loading = true;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: trimmed }),
      });
      const data = await res.json();
      localStorage.setItem(USER_ID_KEY, trimmed);
      goto(data.isNew ? '/setup' : '/releases');
    } catch {
      // Network error — store locally and continue as new user
      localStorage.setItem(USER_ID_KEY, trimmed);
      goto('/setup');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Welcome — Rotation</title>
</svelte:head>

<div class="flex min-h-screen flex-wrap bg-canvas text-ink">

  <!-- Form panel -->
  <div class="flex flex-1 flex-col bg-canvas" style="flex-basis: 480px; min-width: 0">
    <header class="flex items-center px-8 py-5">
      <span class="flex items-center gap-2.5 text-ink">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <rect width="22" height="22" rx="6" fill="#5e6ad2" />
          <circle cx="11" cy="11" r="6" fill="none" stroke="#ffffff" stroke-width="1.6" />
          <circle cx="11" cy="11" r="1.6" fill="#ffffff" />
        </svg>
        <span style="font-size:16px;font-weight:600;letter-spacing:-0.3px">Rotation</span>
      </span>
    </header>

    <main class="flex flex-1 items-center justify-center px-6 pb-24 pt-12">
      <div class="flex w-full max-w-[400px] flex-col gap-8">

        <!-- Heading -->
        <div class="text-center">
          <h1 class="t-display-md m-0" style="font-size: clamp(32px, 5vw, 40px)">FreshMusic</h1>
          <p class="t-body m-0 mt-3 text-ink-subtle">
            Enter your user ID to see new releases from the artists you follow.
          </p>
        </div>

        <!-- Form -->
        <form onsubmit={onSubmit} class="flex flex-col gap-4">
          <Input
            label="User ID"
            placeholder="e.g. river-desk"
            bind:value={userId}
            oninput={onInput}
            autocomplete="username"
            spellcheck={false}
            hint={justCreated ? 'Generated just now' : error || 'The ID you got when you created your account.'}
            invalid={!!error}
          />

          <button
            type="submit"
            disabled={loading}
            class="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-[18px] text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-focus disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Continue'}
            {#if !loading}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            {/if}
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3" aria-hidden="true">
          <span class="h-px flex-1 bg-hairline"></span>
          <span class="t-caption text-ink-subtle">New here?</span>
          <span class="h-px flex-1 bg-hairline"></span>
        </div>

        <!-- Create -->
        <div class="flex flex-col items-center gap-3">
          <Button variant="secondary" size="lg" onclick={onCreate}>
            Create new user ID
          </Button>

          {#if justCreated}
            <div
              role="status"
              class="flex w-full items-center gap-2.5 rounded-md border border-hairline bg-surface-1 px-3.5 py-3"
            >
              <Badge tone="success" dot>Created</Badge>
              <span class="t-body-sm text-ink-muted">
                Your new ID is filled in above. Save it — you'll need it to sign in.
              </span>
            </div>
          {/if}
        </div>

      </div>
    </main>
  </div>

  <!-- Photo panel (order:-1 so it renders on the left) -->
  <svg width="0" height="0" aria-hidden="true" style="position:absolute">
    <defs>
      <clipPath id="wave-edge" clipPathUnits="objectBoundingBox">
        <path d="M0,0 H1 C1,0.18 0.83,0.3 0.86,0.5 C0.89,0.7 1,0.78 1,1 H0 Z" />
      </clipPath>
    </defs>
  </svg>

  <aside
    aria-hidden="true"
    class="relative overflow-hidden bg-black"
    style="order:-1; flex: 1 1 480px; min-height: 420px; clip-path: url(#wave-edge)"
  >
    <img
      src="/welcome-bg.jpg"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      style="object-position: 50% 30%; filter: grayscale(1); opacity: 0.3"
    />
  </aside>

</div>
