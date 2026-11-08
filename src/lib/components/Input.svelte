<script lang="ts">
  interface Props {
    label?: string;
    hint?: string;
    placeholder?: string;
    value?: string;
    type?: string;
    id?: string;
    autocomplete?: string;
    spellcheck?: boolean;
    invalid?: boolean;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    label,
    hint,
    placeholder,
    value = $bindable(''),
    type = 'text',
    id,
    autocomplete,
    spellcheck,
    invalid = false,
    oninput,
    onchange,
  }: Props = $props();

  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <label for={inputId} class="t-body-sm font-medium text-ink-muted">{label}</label>
  {/if}

  <input
    {type}
    id={inputId}
    {placeholder}
    {autocomplete}
    {spellcheck}
    bind:value
    {oninput}
    {onchange}
    class="w-full rounded-md border bg-surface-1 px-3 py-2 text-[14px] text-ink placeholder:text-ink-subtle outline-none transition-shadow duration-150
      focus:shadow-[var(--focus-ring)]
      {invalid
        ? 'border-[var(--color-primary-focus)]'
        : 'border-hairline focus:border-hairline-strong'}"
  />

  {#if hint}
    <span class="t-caption text-ink-subtle">{hint}</span>
  {/if}
</div>
