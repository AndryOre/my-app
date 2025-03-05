<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { ExternalLink } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	const { title, url, description, tags, dateAdded } = $props<{
		title: string;
		url: string;
		description?: string;
		tags: Array<{ name: string; color?: string }>;
		dateAdded: string;
	}>();
</script>

<Card class="overflow-hidden">
	<CardHeader class="p-0">
		<a href={url} target="_blank" rel="noopener noreferrer" class="block">
			<div class="relative aspect-[1.91/1] w-full overflow-hidden bg-[#f8f9fc]">
				<div class="absolute inset-0 flex items-center justify-center">
					<img
						src="https://excalidraw.com/og-image-2.png"
						alt={title}
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</a>
	</CardHeader>
	<CardContent class="grid h-[240px] grid-rows-[auto_1fr_auto_auto] gap-4 p-6">
		<div>
			<a href={url} target="_blank" rel="noopener noreferrer">
				<CardTitle class="line-clamp-1 text-xl font-bold hover:underline">{title}</CardTitle>
			</a>
			<a href={url} target="_blank" rel="noopener noreferrer">
				<p class="truncate text-sm text-muted-foreground hover:underline">{url}</p>
			</a>
		</div>
		<p class="line-clamp-3 text-base text-muted-foreground">{description || ''}</p>
		<div class="flex flex-wrap gap-2 overflow-hidden">
			{#each tags as tag (tag.name)}
				<Badge
					variant="secondary"
					class="text-sm"
					style={tag.color ? `color: ${tag.color}; background-color: ${tag.color}10;` : ''}
				>
					{tag.name.startsWith('#') ? tag.name : `#${tag.name}`}
				</Badge>
			{/each}
		</div>
		<Button
			variant="outline"
			size="sm"
			onclick={() => window.open(url, '_blank', 'noopener,noreferrer')}
			class="w-full"
		>
			<ExternalLink class="mr-2 h-4 w-4" />
			Visitar sitio
		</Button>
	</CardContent>
	<CardFooter>
		<p class="text-sm text-muted-foreground">{dateAdded}</p>
	</CardFooter>
</Card>

<style>
	:global(.dark) .bg-\[\#f8f9fc\] {
		background-color: #1e1e1e;
	}
</style>
