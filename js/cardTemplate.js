import { getRecipes } from "./fetch.js";
document.addEventListener('DOMContentLoaded', async function () {
    // Appel de la fonction getRecipes pour récupérer les recettes
    const recipes = await getRecipes();

    recipes.forEach(recipe => {
        // Chargement de la carte de recette et clone le contenu du template 
        const cardRecipeTemplate = document.getElementById('templateCardRecipe').content.cloneNode(true);
        //défini le chemin des images à récupérer + nom et description des frecttes
        cardRecipeTemplate.querySelector('.card_timeRecipe').textContent = recipe.time + 'min';
        cardRecipeTemplate.querySelector('.card_img').src = `assets/images/${recipe.image}`;
        cardRecipeTemplate.querySelector('.title_Recipe').textContent = recipe.name;
        cardRecipeTemplate.querySelector('.recipe_description').textContent = recipe.description;

        // Chargement des détails des ingrédients
        const ingredientsList = cardRecipeTemplate.querySelector('.ingredients_cards');
        recipe.ingredients.forEach(ingredient => {
            const ingredientDetail = document.getElementById('templateIngredientsDetails').content.cloneNode(true);
            ingredientDetail.querySelector('.ingredients_name').textContent = ingredient.ingredient;
            // Gère le cas où l'unité n'est pas spécifiée
            const quantityText = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}`.trim() : '';
            ingredientDetail.querySelector('.ingredient_quantity').textContent = quantityText;
            ingredientsList.appendChild(ingredientDetail);
        });

        // Ajoute la carte de recette complétée au DOM
        document.getElementById('recipeCards').appendChild(cardRecipeTemplate);
    });
});

