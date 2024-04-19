import { getRecipes } from "./fetch.js";
import { FiltersManager } from "./main.js";
import { displayRecipes } from "./cardTemplate.js";
/**
 * Ajouter les écouteurs d'événements pour les éléments de saisie de chaque filtre
 * @param {[string]} inputId : Id des barre de recherches (serarchbar_)
 * @param {[string]} dropdownId : Id des dropdown_ingrédients, dropdown-ustensils, dropdown-appliances
 */
function addFiltersListener(inputId, dropdownId) {
    document.getElementById(inputId).addEventListener("keyup", () => {
        filterFunction(inputId, dropdownId);
    });
}
/**
 * filtrer les éléments en fonction de la saisie utilisateur
 * @param {[string]} inputId : Id des barre de recherches (serarchbar_)
 * @param {[string]} dropdownId : Id des dropdown_ingrédients, dropdown-ustensils, dropdown-appliances
 */
function filterFunction(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const div = document.getElementById(dropdownId);
    const options = div.getElementsByTagName("a");
    for (const option of options) {
        const txtValue = option.textContent || option.innerText;
        option.style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
    }
}

/**
 *Récupération des éléments de filtres (ingrédients, ustensiles, appareils)
 * @returns {{ allIngredients: [string], allAppliances: [string], allUstensils: [string] }} 
 */
export function getAllValues(recipe, allIngredients, allUstensils, allAppliances) {

    allIngredients = [...new Set(textOptionsNormalizer(recipe.ingredients, allIngredients, true))];
    allUstensils = [...new Set(textOptionsNormalizer(recipe.ustensils, allUstensils))];
    allAppliances = [...new Set(textOptionsNormalizer([recipe.appliance], allAppliances))];

    return { allIngredients, allAppliances, allUstensils };
}
/**
 * Uniformisation des noms des élements dans les tableaux 
 * @param {[string]} type : type de filtres (ustensiles, ingrédients,appareils)
 * @param {[string]} allTypes : tableau final contenant les filtres 
 * @param {boolean} hasIngredient : si le type est ingrédient ou non 
 
 */
function textOptionsNormalizer(type, allTypes, hasIngredient = false) {

    type.forEach(element => {

        let normalizedType = hasIngredient ? element.ingredient.toLowerCase() : element.toLowerCase();
        normalizedType = singularize(normalizedType);
        normalizedType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
        allTypes.push(normalizedType);
    });
    return allTypes
}
/**
 * Convertir un mot au singulier
 * @param {string} word : mot à convertir
 * @returns {string} : mot au singulier
 */
function singularize(word) {

    if (word.endsWith("s") && word !== "ananas" && word !== "maïs") {
        return word.slice(0, -1);
    }
    return word;
}

// Instance de la classe FilterManager
const filterManager = new FiltersManager();

// Initialisation des filtres
const allItems = await filterManager.initializeFilters();
filterManager.initializeInputEvents();

// Ajouter les écouteurs d'événements pour les filtres
addFiltersListener("searchbar-ingredient", "dropdown-ingredients");
addFiltersListener("searchbar-appliances", "dropdown-appliances");
addFiltersListener("searchbar-ustensils", "dropdown-ustensils");



// Gestion barre de filtre principale
async function globalSearch() {
    const userResearch = this.value.toLowerCase().trim();
    const recipes = await getRecipes();
    const totalRecipes = recipes.length;
    if (userResearch.length >= 3) {
        isAllRecipesLoaded = false
        document.getElementById('recipe-cards').innerHTML = "";
        const finalRecipes = filterRecipes(userResearch, recipes);
        updateDisplayRecipes(finalRecipes)
    } else {
        if (!isAllRecipesLoaded) {
            document.getElementById('recipe-cards').innerHTML = "";
            recipes.forEach(recipe => {
                displayRecipes(recipe)
            });
            isAllRecipesLoaded = true
            filterManager.addAllItemsToFiltersList(allItems, filterManager);
        }
        document.getElementById('number-recipes').innerText = totalRecipes + " recettes";
    }

}
const mainSearchInput = document.getElementById('main-searchbar');
let isAllRecipesLoaded = false
mainSearchInput.addEventListener('input', globalSearch)

/**
 * Gère l'affichage des recettes après le filtres des recettes
 * @param {array} recipes : recettes à afficher
 */
function updateDisplayRecipes(recipes) {
    let allIngredients = [], allAppliances = [], allUstensils = [];
    for (const recipe of recipes) {
        displayRecipes(recipe);
        const allItems = getAllValues(recipe, allIngredients, allUstensils, allAppliances)
        filterManager.addAllItemsToFiltersList(allItems, filterManager);

    }
    document.getElementById('number-recipes').innerText = recipes.length + " recettes";
}


