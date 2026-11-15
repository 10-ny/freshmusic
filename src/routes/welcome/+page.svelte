<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '#lib/components/Button.svelte';
  import Input from '#lib/components/Input.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import { words } from '#lib/data/wordlist';

  type Mode = 'signin' | 'create';

  let mode = $state<Mode>('signin');

  // Shared
  let username = $state('');
  let password = $state('');
  let loading  = $state(false);
  let error    = $state('');

  // Create-only
  let confirm      = $state('');
  let justCreated  = $state(false);

  function generate() {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    username = `${words[buf[0] % words.length]}-${words[buf[1] % words.length]}`;
    justCreated = true;
    error = '';
  }

  function switchMode(m: Mode) {
    mode = m;
    username = '';
    password = '';
    confirm = '';
    error = '';
    justCreated = false;
  }

  async function onSignIn(e: SubmitEvent) {
    e.preventDefault();
    if (!username.trim() || !password) { error = 'Please enter your username and password.'; return; }
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        error = data.message ?? 'Invalid username or password.';
        return;
      }
      goto('/releases');
    } catch {
      error = 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function onCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!username.trim())       { error = 'Please enter or generate a username.'; return; }
    if (!password)               { error = 'Please enter a password.'; return; }
    if (password !== confirm)    { error = 'Passwords do not match.'; return; }
    if (password.length < 8)     { error = 'Password must be at least 8 characters.'; return; }
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        error = res.status === 409 ? 'That username is already taken. Try generating a new one.' : (data.message ?? 'Something went wrong.');
        return;
      }
      goto('/setup');
    } catch {
      error = 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Welcome — FreshMusic</title>
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
        <span style="font-size:16px;font-weight:600;letter-spacing:-0.3px">FreshMusic</span>
      </span>
    </header>

    <main class="flex flex-1 items-center justify-center px-6 pb-24 pt-12">
      <div class="flex w-full max-w-[400px] flex-col gap-8">

        {#if mode === 'signin'}
          <!-- Sign in -->
          <div class="text-center">
            <h1 class="t-display-md m-0" style="font-size: clamp(32px, 5vw, 40px)">FreshMusic</h1>
            <p class="t-body m-0 mt-3 text-ink-subtle">
              Sign in to see new releases from the artists you follow.
            </p>
          </div>

          <form onsubmit={onSignIn} class="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="e.g. river-desk"
              bind:value={username}
              autocomplete="username"
              spellcheck={false}
              hint={error || ''}
              invalid={!!error}
            />
            <Input
              label="Password"
              type="password"
              bind:value={password}
              autocomplete="current-password"
              hint=""
            />
            <button
              type="submit"
              disabled={loading}
              class="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-[18px] text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-focus disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {#if !loading}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              {/if}
            </button>
          </form>

          <div class="flex items-center gap-3" aria-hidden="true">
            <span class="h-px flex-1 bg-hairline"></span>
            <span class="t-caption text-ink-subtle">New here?</span>
            <span class="h-px flex-1 bg-hairline"></span>
          </div>

          <div class="flex flex-col items-center">
            <Button variant="secondary" size="lg" onclick={() => switchMode('create')}>
              Create an account
            </Button>
          </div>

        {:else}
          <!-- Create account -->
          <div class="text-center">
            <h1 class="t-display-md m-0" style="font-size: clamp(32px, 5vw, 40px)">Create account</h1>
            <p class="t-body m-0 mt-3 text-ink-subtle">
              You'll get a word-pair username. Save it — you'll use it to sign in.
            </p>
          </div>

          <form onsubmit={onCreate} class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Input
                label="Username"
                placeholder="e.g. river-desk"
                bind:value={username}
                autocomplete="username"
                spellcheck={false}
                hint={justCreated ? 'Generated just now — save this' : ''}
              />
              <Button variant="secondary" size="sm" onclick={generate}>
                Generate username
              </Button>
            </div>
            <Input
              label="Password"
              type="password"
              bind:value={password}
              autocomplete="new-password"
              hint="At least 8 characters"
            />
            <Input
              label="Confirm password"
              type="password"
              bind:value={confirm}
              autocomplete="new-password"
              hint={error || ''}
              invalid={!!error}
            />
            <button
              type="submit"
              disabled={loading}
              class="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-[18px] text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-focus disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
              {#if !loading}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              {/if}
            </button>
          </form>

          <div class="flex flex-col items-center">
            <Button variant="tertiary" size="lg" onclick={() => switchMode('signin')}>
              Already have an account? Sign in
            </Button>
          </div>
        {/if}

      </div>
    </main>
  </div>

  <!-- Photo panel -->
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
