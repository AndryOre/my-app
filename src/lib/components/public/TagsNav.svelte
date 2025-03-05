<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, ChevronUp, Tag as TagIcon } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let props = $props<{
		tags: Array<{ name: string; color: string | null; count: number }>;
		selectedTags: string[];
		onTagSelect: (tag: string, selected: boolean) => void;
	}>();

	// Usar $state para variables reactivas
	let expanded = $state(false);
	let showAllTags = $state(false);

	// Número de tags a mostrar en la primera línea (ajustar según diseño)
	const tagsPerRow = 10;

	function toggleTag(tagName: string) {
		const isSelected = props.selectedTags.includes(tagName);
		props.onTagSelect(tagName, !isSelected);
	}

	function toggleExpand() {
		expanded = !expanded;
	}

	const visibleTags = $derived(showAllTags ? props.tags : props.tags.slice(0, tagsPerRow));
	const hasMoreTags = $derived(props.tags.length > tagsPerRow);
</script>

<div class="mb-4 w-full rounded-md bg-card p-3 shadow-sm">
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<TagIcon class="h-4 w-4" />
			<h3 class="text-sm font-medium">Filtrar por tags</h3>
		</div>
		{#if hasMoreTags}
			<Button variant="ghost" size="sm" class="h-8 px-2 text-xs" onclick={toggleExpand}>
				{#if expanded}
					<ChevronUp class="mr-1 h-4 w-4" />
					<span>Mostrar menos</span>
				{:else}
					<ChevronDown class="mr-1 h-4 w-4" />
					<span>Mostrar más</span>
				{/if}
			</Button>
		{/if}
	</div>

	<div
		class="flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ease-in-out"
		style={expanded ? 'max-height: 1000px' : 'max-height: 40px'}
	>
		{#each visibleTags as tag (tag.name)}
			<Badge
				variant={props.selectedTags.includes(tag.name) ? 'default' : 'secondary'}
				class="cursor-pointer text-sm transition-colors hover:opacity-80"
				style={tag.color
					? `color: ${props.selectedTags.includes(tag.name) ? 'white' : tag.color}; 
                       background-color: ${props.selectedTags.includes(tag.name) ? tag.color : tag.color + '10'};`
					: ''}
				onclick={() => toggleTag(tag.name)}
			>
				{tag.name.startsWith('#') ? tag.name : `#${tag.name}`}
				<span class="ml-1 text-xs opacity-70">({tag.count})</span>
			</Badge>
		{/each}

		{#if !expanded && hasMoreTags}
			<Badge variant="outline" class="cursor-pointer bg-background text-sm" onclick={toggleExpand}>
				+{props.tags.length - tagsPerRow} más
			</Badge>
		{/if}
	</div>

	{#if expanded}
		<div class="mt-2 text-right" transition:slide={{ duration: 200 }}>
			<Button
				variant="link"
				size="sm"
				class="h-6 p-0 text-xs"
				onclick={() => (showAllTags = !showAllTags)}
			>
				{showAllTags ? 'Mostrar menos tags' : 'Mostrar todos los tags'}
			</Button>
		</div>
	{/if}
</div>
