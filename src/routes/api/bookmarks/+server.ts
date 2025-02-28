import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                bookmarks: {
                    include: {
                        tags: true,
                        healthChecks: {
                            orderBy: {
                                timestamp: 'desc'
                            },
                            take: 1
                        }
                    },
                    orderBy: {
                        dateAdded: 'desc'
                    }
                }
            },
            orderBy: {
                title: 'asc'
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