import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                title: true,
                dateAdded: true,
                dateModified: true,
                _count: {
                    select: {
                        bookmarks: true
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
                bookmarkCount: category._count.bookmarks
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