<script lang="ts">
	import { z } from 'zod';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search } from 'lucide-svelte';
	import { superForm, defaults } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zod } from 'sveltekit-superforms/adapters';

	const searchSchema = z.object({
		searchTerm: z.string().max(50)
	});

	let { placeholder = 'Buscar bookmarks...', onSearch } = $props<{
		placeholder?: string;
		onSearch: (searchTerm: string) => void;
	}>();

	const form = superForm(defaults(zod(searchSchema)), {
		SPA: true,
		validators: zodClient(searchSchema)
	});

	const { form: formData, enhance } = form;

	// Variable para almacenar el último término de búsqueda procesado
	let lastProcessedTerm = $state('');

	$effect(() => {
		const currentTerm = $formData.searchTerm || '';

		// Solo procesar si el término ha cambiado
		if (currentTerm !== lastProcessedTerm) {
			console.log('effect triggered', currentTerm);
			lastProcessedTerm = currentTerm;

			if (currentTerm === '') {
				onSearch('');
			} else if (currentTerm.length >= 2) {
				console.log('calling search with:', currentTerm);
				onSearch(currentTerm);
			}
		}
	});
</script>

<form method="POST" use:enhance class="relative w-full max-w-md">
	<Form.Field {form} name="searchTerm">
		<Form.Control>
			{#snippet children({ props })}
				<div class="relative">
					<Input {...props} type="text" bind:value={$formData.searchTerm} {placeholder} />
					<Button
						type="submit"
						variant="ghost"
						size="icon"
						class="absolute right-0 top-0 h-10 w-10"
					>
						<Search class="h-4 w-4" />
						<span class="sr-only">Buscar</span>
					</Button>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
