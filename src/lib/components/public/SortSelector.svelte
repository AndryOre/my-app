<script lang="ts">
	import { ArrowUpNarrowWide, ArrowDownNarrowWide, ChevronDown } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	type SortField = 'date' | 'alphabetical';
	type SortDirection = 'asc' | 'desc';

	const {
		initialField = 'date',
		initialDirection = 'desc',
		onChange = undefined
	} = $props<{
		initialField?: SortField;
		initialDirection?: SortDirection;
		onChange?: (data: { field: SortField; direction: SortDirection }) => void;
	}>();

	let field = $state<SortField>(initialField);
	let direction = $state<SortDirection>(initialDirection);

	function handleSortChange(newField: SortField) {
		if (field === newField) {
			direction = direction === 'asc' ? 'desc' : 'asc';
		} else {
			field = newField;
			direction = newField === 'date' ? 'desc' : 'asc';
		}

		if (onChange) {
			onChange({ field, direction });
		}
	}

	const buttonText = $derived(
		field === 'date'
			? direction === 'desc'
				? 'Date (Newest)'
				: 'Date (Oldest)'
			: direction === 'asc'
				? 'Name (A-Z)'
				: 'Name (Z-A)'
	);

	const DirectionIcon = $derived(direction === 'asc' ? ArrowUpNarrowWide : ArrowDownNarrowWide);

	// Textos dinámicos para las opciones del menú
	const dateOptionText = $derived(
		field === 'date' && direction === 'asc' ? 'Date (Oldest)' : 'Date (Newest)'
	);

	const nameOptionText = $derived(
		field === 'alphabetical' && direction === 'desc' ? 'Name (Z-A)' : 'Name (A-Z)'
	);
</script>

<div class="flex items-center gap-2">
	<span class="text-sm font-medium text-muted-foreground">Sort by</span>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" size="sm" class="flex items-center gap-1" {...props}>
					{buttonText}
					<DirectionIcon class="h-4 w-4" />
					<ChevronDown class="ml-1 h-4 w-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content align="end" class="w-[180px]">
			<DropdownMenu.Item
				class="flex items-center justify-between"
				onclick={() => handleSortChange('date')}
			>
				<span>{dateOptionText}</span>
				{#if field === 'date'}
					<DirectionIcon class="h-4 w-4" />
				{/if}
			</DropdownMenu.Item>

			<DropdownMenu.Item
				class="flex items-center justify-between"
				onclick={() => handleSortChange('alphabetical')}
			>
				<span>{nameOptionText}</span>
				{#if field === 'alphabetical'}
					<DirectionIcon class="h-4 w-4" />
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
