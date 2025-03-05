<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Sidebar,
		SidebarMenu,
		SidebarMenuItem,
		SidebarMenuButton
	} from '$lib/components/ui/sidebar';
	import { FolderIcon } from 'lucide-svelte';

	interface Category {
		id: string;
		title: string;
		bookmarkCount: number;
	}

	let props = $props<{
		categories: Category[];
		selectedCategoryId: string | null;
		onSelectCategory: (categoryId: string | null) => void;
	}>();

	function handleKeydown(e: KeyboardEvent, categoryId: string | null) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			props.onSelectCategory(categoryId);
		}
	}
</script>

<Sidebar class="h-full border-r">
	<SidebarMenu class="space-y-2 p-2">
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={props.selectedCategoryId === null}
				onclick={() => props.onSelectCategory(null)}
				onkeydown={(e) => handleKeydown(e, null)}
				class="hover:bg-accent/50 active:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
			>
				<div class="flex w-full items-center justify-between py-1">
					<span class="text-base font-medium">All</span>
					<Badge variant="secondary" class="ml-auto text-sm">
						{props.categories.reduce((acc: number, cat: Category) => acc + cat.bookmarkCount, 0)}
					</Badge>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>

		<section class="space-y-1.5">
			{#each props.categories as category (category.id)}
				<SidebarMenuItem>
					<SidebarMenuButton
						isActive={props.selectedCategoryId === category.id}
						onclick={() => props.onSelectCategory(category.id)}
						onkeydown={(e) => handleKeydown(e, category.id)}
						class="w-full hover:bg-accent/50 active:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
					>
						<div class="flex w-full items-center justify-between py-1">
							<div class="flex items-center gap-3">
								<FolderIcon class="h-5 w-5" />
								<span class="text-base">{category.title}</span>
							</div>
							<Badge variant="secondary" class="ml-auto text-sm">
								{category.bookmarkCount}
							</Badge>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			{/each}
		</section>
	</SidebarMenu>
</Sidebar>

<style>
	section {
		min-height: 2rem;
	}
</style>
