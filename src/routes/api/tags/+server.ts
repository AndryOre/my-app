import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const tags = await prisma.tag.findMany({
			select: {
				id: true,
				name: true,
				color: true,
				_count: {
					select: {
						bookmarks: true
					}
				}
			},
			orderBy: {
				name: 'asc'
			}
		});

		return json({
			success: true,
			data: tags.map((tag) => ({
				id: tag.id,
				name: tag.name,
				color: tag.color,
				count: tag._count.bookmarks
			}))
		});
	} catch (error) {
		console.error('Fetch error:', error);
		return json(
			{
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{
				status: 500
			}
		);
	}
}
