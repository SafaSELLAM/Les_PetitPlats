import { getRecipes } from "./fetch.js";
document.addEventListener('DOMContentLoaded', async function () {
    // Appel de la fonction getRecipes pour récupérer les recettes
    const recipes = await getRecipes();

    recipes.forEach(recipe => {
        displayRecipes(recipe)
    });
});

export function displayRecipes(recipe) {
    // Chargement de la carte de recette et clone le contenu du template 
    const cardRecipeTemplate = document.getElementById('template-card-recipe').content.cloneNode(true);
    //défini le chemin des images à récupérer + nom et description des frecttes
    cardRecipeTemplate.querySelector('.card-time-recipe').textContent = recipe.time + 'min';
    cardRecipeTemplate.querySelector('.card-img').src = `assets/images/${recipe.image}`;
    cardRecipeTemplate.querySelector('.title-recipe').textContent = recipe.name;
    cardRecipeTemplate.querySelector('.recipe-description').textContent = recipe.description;

    // Chargement des détails des ingrédients
    const ingredientsList = cardRecipeTemplate.querySelector('.ingredients-cards');
    recipe.ingredients.forEach(ingredient => {
        const ingredientDetail = document.getElementById('template-ingredients-details').content.cloneNode(true);
        ingredientDetail.querySelector('.ingredients-name').textContent = ingredient.ingredient;
        // Gère le cas où l'unité n'est pas spécifiée
        const quantityText = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}`.trim() : '';
        ingredientDetail.querySelector('.ingredient-quantity').textContent = quantityText;
        ingredientsList.appendChild(ingredientDetail);
    });

    // Ajoute la carte de recette complétée au DOM
    document.getElementById('recipe-cards').appendChild(cardRecipeTemplate);
}