<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<h1 class="text-3xl font-bold underline text-orange-500">Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<Button>Click me</Button>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>