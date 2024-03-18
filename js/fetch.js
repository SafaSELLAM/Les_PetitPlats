export async function getRecipes() {
    try {
        const response = await fetch('http://localhost:5501/recipes.json')
        if (!response.ok) {
            throw new Error('datas can not be fetched')
        }
        const dataJson = await response.json()
        const recipes = dataJson.recipes
        return recipes
    } catch (error) {
        console.error(error);
        return []
    }
}