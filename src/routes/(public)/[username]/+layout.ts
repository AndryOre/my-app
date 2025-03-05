import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params, url }) => {
	// Obtener el ID de categoría de los parámetros de consulta
	const categoryId = url.searchParams.get('category');

	try {
		// Fetch de categorías
		const categoriesResponse = await fetch('/api/categories');
		const categoriesResult = await categoriesResponse.json();

		if (!categoriesResult.success) {
			console.error('Error fetching categories:', categoriesResult.message);
			return {
				categories: [],
				username: params.username,
				selectedCategoryId: categoryId
			};
		}

		return {
			categories: categoriesResult.data,
			username: params.username,
			selectedCategoryId: categoryId
		};
	} catch (error) {
		console.error('Error in layout load function:', error);
		return {
			categories: [],
			username: params.username,
			selectedCategoryId: categoryId
		};
	}
};
