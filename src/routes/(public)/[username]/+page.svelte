<script lang="ts">
	import { onMount } from 'svelte';
	import BookmarkCard from '$lib/components/public/BookmarkCard.svelte';
	import TagsNav from '$lib/components/public/TagsNav.svelte';
	import SearchBar from '$lib/components/public/SearchBar.svelte';
	import SortSelector from '$lib/components/public/SortSelector.svelte';
	import type { Bookmark, Tag } from '@prisma/client';
	import { Loader2 } from 'lucide-svelte';
	import { format } from 'date-fns';

	type BookmarkWithTags = Omit<Bookmark, 'tags'> & {
		tags: Pick<Tag, 'name' | 'color'>[];
	};

	type TagWithCount = Pick<Tag, 'name' | 'color'> & {
		count: number;
	};

	// Obtener datos del layout
	let { data } = $props();
	const selectedCategoryId = $derived(data.selectedCategoryId);

	// Estado base
	let bookmarks = $state<BookmarkWithTags[]>([]);
	let allTags = $state<TagWithCount[]>([]);
	let selectedTags = $state<string[]>([]);
	let searchTerm = $state('');
	let sortField = $state<'date' | 'alphabetical'>('date');
	let sortDirection = $state<'asc' | 'desc'>('desc');
	let filteredBookmarks = $state<BookmarkWithTags[]>([]);

	let loadingBookmarks = $state(true);
	let loadingTags = $state(true);

	// Actualizar filteredBookmarks cuando cambian las dependencias
	$effect(() => {
		// Primero filtrar por búsqueda
		let filtered = searchTerm.trim()
			? bookmarks.filter((bookmark) => {
					const normalizedSearchTerm = searchTerm.toLowerCase().trim();
					return (
						bookmark.title.toLowerCase().includes(normalizedSearchTerm) ||
						bookmark.description?.toLowerCase().includes(normalizedSearchTerm) ||
						bookmark.url.toLowerCase().includes(normalizedSearchTerm) ||
						bookmark.tags.some((tag) => tag.name.toLowerCase().includes(normalizedSearchTerm))
					);
				})
			: [...bookmarks];

		// Luego ordenar
		if (sortField === 'date') {
			filtered.sort((a, b) => {
				const dateA = new Date(a.dateAdded).getTime();
				const dateB = new Date(b.dateAdded).getTime();
				return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
			});
		} else {
			filtered.sort((a, b) => {
				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();
				return sortDirection === 'asc'
					? titleA.localeCompare(titleB)
					: titleB.localeCompare(titleA);
			});
		}

		filteredBookmarks = filtered;
	});

	async function fetchTags() {
		loadingTags = true;
		try {
			const response = await fetch('/api/tags');
			const result = await response.json();
			if (result.success) {
				allTags = result.data as TagWithCount[];
			}
		} catch (error) {
			console.error('Error fetching tags:', error);
		} finally {
			loadingTags = false;
		}
	}

	async function fetchBookmarks() {
		loadingBookmarks = true;
		const url = new URL('/api/bookmarks', window.location.origin);

		// Usar el selectedCategoryId del layout
		if (selectedCategoryId) {
			url.searchParams.set('categoryId', selectedCategoryId);
		}

		if (selectedTags.length > 0) {
			url.searchParams.set('tags', selectedTags.join(','));
		}

		try {
			const response = await fetch(url);
			const result = await response.json();

			if (result.success) {
				if (selectedCategoryId || selectedTags.length > 0) {
					// Si hay filtros, la API devuelve un array plano de bookmarks
					bookmarks = result.data as BookmarkWithTags[];
				} else {
					// Si no hay filtros, la API devuelve categorías con bookmarks anidados
					bookmarks = result.data.flatMap(
						(cat: { bookmarks: BookmarkWithTags[] }) => cat.bookmarks
					);
				}
			}
		} catch (error) {
			console.error('Error fetching bookmarks:', error);
			bookmarks = [];
		} finally {
			loadingBookmarks = false;
		}
	}

	function handleTagSelect(tag: string, selected: boolean) {
		if (selected) {
			selectedTags = [...selectedTags, tag];
		} else {
			selectedTags = selectedTags.filter((t) => t !== tag);
		}

		fetchBookmarks();
	}

	function handleSearch(term: string) {
		searchTerm = term;
	}

	function handleSortChange({
		field,
		direction
	}: {
		field: 'date' | 'alphabetical';
		direction: 'asc' | 'desc';
	}) {
		sortField = field;
		sortDirection = direction;
	}

	// Efecto para cargar bookmarks cuando cambia la categoría seleccionada
	$effect(() => {
		if (selectedCategoryId !== undefined) {
			fetchBookmarks();
		}
	});

	onMount(() => {
		fetchTags();
		fetchBookmarks();
	});
</script>

<div class="flex h-[calc(100vh-4rem)]">
	<main class="flex-1 overflow-y-auto">
		<div class="p-4">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<SearchBar onSearch={handleSearch} />
				<SortSelector
					initialField={sortField}
					initialDirection={sortDirection}
					onChange={handleSortChange}
				/>
			</div>
		</div>

		{#if loadingTags}
			<div class="flex justify-center p-4">
				<Loader2 class="h-6 w-6 animate-spin text-primary" />
			</div>
		{:else}
			<TagsNav tags={allTags} {selectedTags} onTagSelect={handleTagSelect} />
		{/if}

		{#if loadingBookmarks}
			<div class="flex h-[calc(100vh-12rem)] items-center justify-center">
				<div class="text-center">
					<Loader2 class="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
					<p class="text-muted-foreground">Cargando bookmarks...</p>
				</div>
			</div>
		{:else if filteredBookmarks.length === 0}
			<div class="flex h-[calc(100vh-12rem)] items-center justify-center">
				<div class="max-w-md p-6 text-center">
					<p class="mb-2 text-xl font-semibold">No hay bookmarks</p>
					<p class="text-muted-foreground">
						{searchTerm
							? 'No se encontraron bookmarks que coincidan con tu búsqueda.'
							: 'No se encontraron bookmarks con los filtros seleccionados.'}
					</p>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredBookmarks as bookmark (bookmark.url)}
					<BookmarkCard
						title={bookmark.title}
						url={bookmark.url}
						tags={bookmark.tags.map((tag) => ({
							name: tag.name,
							color: tag.color || undefined
						}))}
						description={bookmark.description ?? undefined}
						dateAdded={format(new Date(bookmark.dateAdded), 'MMMM d, yyyy')}
					/>
				{/each}
			</div>
		{/if}
	</main>
</div>
