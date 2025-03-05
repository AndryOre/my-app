import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Clean existing data
	await prisma.healthCheck.deleteMany({});
	await prisma.bookmark.deleteMany({});
	await prisma.category.deleteMany({});
	await prisma.tag.deleteMany({});

	console.log('Seeding database...');

	// Create categories
	const developmentCategory = await prisma.category.create({
		data: {
			title: 'Development'
		}
	});

	const designCategory = await prisma.category.create({
		data: {
			title: 'Design'
		}
	});

	const productivityCategory = await prisma.category.create({
		data: {
			title: 'Productivity'
		}
	});

	// Create tags
	const javascriptTag = await prisma.tag.create({
		data: {
			name: 'javascript',
			color: '#F7DF1E'
		}
	});

	const typescriptTag = await prisma.tag.create({
		data: {
			name: 'typescript',
			color: '#3178C6'
		}
	});

	const uiTag = await prisma.tag.create({
		data: {
			name: 'ui',
			color: '#FF5733'
		}
	});

	const toolsTag = await prisma.tag.create({
		data: {
			name: 'tools',
			color: '#4CAF50'
		}
	});

	// Create bookmarks with tags and health checks
	await prisma.bookmark.create({
		data: {
			title: 'GitHub',
			url: 'https://github.com',
			description: 'Where the world builds software',
			categoryId: developmentCategory.id,
			isAvailable: true,
			tags: {
				connect: [{ id: toolsTag.id }]
			},
			healthChecks: {
				create: [
					{
						status: true,
						statusCode: 200,
						responseTime: 250
					}
				]
			}
		}
	});

	await prisma.bookmark.create({
		data: {
			title: 'TypeScript Documentation',
			url: 'https://www.typescriptlang.org/docs/',
			description: 'Official TypeScript documentation',
			categoryId: developmentCategory.id,
			isAvailable: true,
			tags: {
				connect: [{ id: typescriptTag.id }, { id: javascriptTag.id }]
			},
			healthChecks: {
				create: [
					{
						status: true,
						statusCode: 200,
						responseTime: 180
					}
				]
			}
		}
	});

	await prisma.bookmark.create({
		data: {
			title: 'Figma',
			url: 'https://www.figma.com',
			description: 'Collaborative interface design tool',
			categoryId: designCategory.id,
			isAvailable: true,
			tags: {
				connect: [{ id: uiTag.id }, { id: toolsTag.id }]
			},
			healthChecks: {
				create: [
					{
						status: true,
						statusCode: 200,
						responseTime: 300
					}
				]
			}
		}
	});

	await prisma.bookmark.create({
		data: {
			title: 'Notion',
			url: 'https://www.notion.so',
			description: 'All-in-one workspace for notes, tasks, wikis, and databases',
			categoryId: productivityCategory.id,
			isAvailable: true,
			tags: {
				connect: [{ id: toolsTag.id }]
			},
			healthChecks: {
				create: [
					{
						status: true,
						statusCode: 200,
						responseTime: 220
					}
				]
			}
		}
	});

	await prisma.bookmark.create({
		data: {
			title: 'Private Notes',
			url: 'https://example.com/private-notes',
			description: 'My private development notes',
			categoryId: developmentCategory.id,
			isPrivate: true,
			tags: {
				connect: [{ id: javascriptTag.id }]
			}
		}
	});

	console.log('Database seeded successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
