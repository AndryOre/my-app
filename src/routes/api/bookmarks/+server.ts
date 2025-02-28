import { json } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

const prisma = new PrismaClient();

type BookmarkWithRelations = Prisma.BookmarkGetPayload<{
    include: {
        category: true;
        tags: true;
        healthChecks: true;
    }
}>;

export async function GET({ url }: RequestEvent) {
    try {
        const categoryId = url.searchParams.get('categoryId');
        const tags = url.searchParams.get('tags')?.split(',').filter(Boolean);

        const bookmarksQuery: Prisma.BookmarkFindManyArgs = {
            include: {
                tags: true,
                category: true,
                healthChecks: {
                    orderBy: {
                        timestamp: 'desc' as const
                    },
                    take: 1
                }
            },
            where: {
                AND: [
                    categoryId ? { categoryId } : {},
                    tags?.length ? {
                        tags: {
                            some: {
                                name: {
                                    in: tags
                                }
                            }
                        }
                    } : {}
                ]
            },
            orderBy: {
                dateAdded: 'desc' as const
            }
        };

        if (categoryId || tags?.length) {
            const bookmarks = await prisma.bookmark.findMany(bookmarksQuery) as BookmarkWithRelations[];
            
            return json({
                success: true,
                data: bookmarks.map(bookmark => ({
                    id: bookmark.id,
                    title: bookmark.title,
                    url: bookmark.url,
                    dateAdded: bookmark.dateAdded,
                    lastChecked: bookmark.lastChecked,
                    isAvailable: bookmark.isAvailable,
                    isPrivate: bookmark.isPrivate,
                    comment: bookmark.comment,
                    category: bookmark.category,
                    tags: bookmark.tags,
                    lastHealthCheck: bookmark.healthChecks[0] || null
                }))
            });
        }

        // Si no hay filtros, mantener el comportamiento original agrupado por categorías
        const categories = await prisma.category.findMany({
            include: {
                bookmarks: {
                    include: {
                        tags: true,
                        healthChecks: {
                            orderBy: {
                                timestamp: 'desc' as const
                            },
                            take: 1
                        }
                    },
                    orderBy: {
                        dateAdded: 'desc' as const
                    }
                }
            },
            orderBy: {
                title: 'asc' as const
            }
        });

        return json({
            success: true,
            data: categories.map(category => ({
                id: category.id,
                title: category.title,
                dateAdded: category.dateAdded,
                dateModified: category.dateModified,
                bookmarks: category.bookmarks.map(bookmark => ({
                    id: bookmark.id,
                    title: bookmark.title,
                    url: bookmark.url,
                    dateAdded: bookmark.dateAdded,
                    lastChecked: bookmark.lastChecked,
                    isAvailable: bookmark.isAvailable,
                    isPrivate: bookmark.isPrivate,
                    comment: bookmark.comment,
                    tags: bookmark.tags,
                    lastHealthCheck: bookmark.healthChecks[0] || null
                }))
            }))
        });
    } catch (error) {
        console.error('Fetch error:', error);
        return json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error' 
        }, { 
            status: 500 
        });
    }
}; 