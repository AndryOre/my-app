import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BookmarkJson {
	id: string;
	title: string;
	url?: string;
	children?: BookmarkJson[];
	dateAdded?: number;
	parentId?: string;
}

async function processBookmarks(bookmarks: BookmarkJson[]) {
	for (const bookmark of bookmarks) {
		if (bookmark.children) {
			// Si es una carpeta, crear categoría
			const category = await prisma.category.create({
				data: {
					title: bookmark.title,
					dateAdded: bookmark.dateAdded ? new Date(bookmark.dateAdded) : new Date(),
					dateModified: new Date()
				}
			});

			// Procesar bookmarks de la carpeta
			for (const child of bookmark.children) {
				if (child.url) {
					await prisma.bookmark.create({
						data: {
							title: child.title,
							url: child.url,
							categoryId: category.id,
							dateAdded: child.dateAdded ? new Date(child.dateAdded) : new Date()
						}
					});
				} else if (child.children) {
					// Si es una subcarpeta, crear como categoría de nivel raíz
					const subCategory = await prisma.category.create({
						data: {
							title: child.title,
							dateAdded: child.dateAdded ? new Date(child.dateAdded) : new Date(),
							dateModified: new Date()
						}
					});

					// Procesar bookmarks de la subcarpeta
					for (const subChild of child.children) {
						if (subChild.url) {
							await prisma.bookmark.create({
								data: {
									title: subChild.title,
									url: subChild.url,
									categoryId: subCategory.id,
									dateAdded: subChild.dateAdded ? new Date(subChild.dateAdded) : new Date()
								}
							});
						}
					}
				}
			}
		}
	}
}

export async function POST({ request }: RequestEvent) {
	try {
		const bookmarks = (await request.json()) as BookmarkJson[];
		await processBookmarks(bookmarks);
		return json({ success: true, message: 'Bookmarks imported successfully' });
	} catch (error) {
		console.error('Import error:', error);
		return json(
			{ success: false, message: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}
