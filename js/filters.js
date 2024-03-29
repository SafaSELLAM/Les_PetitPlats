// import { FilterManager } from "./main.js";
import { getRecipes } from "./fetch.js";
import { FilterManager } from "./main.js";
// Ajouter les écouteurs d'événements pour les éléments de saisie de chaque filtre
function addFilterListener(inputId, dropdownId) {
    document.getElementById(inputId).addEventListener("keyup", () => {
        filterFunction(inputId, dropdownId);
    });
}

// Fonction générique pour filtrer les éléments en fonction de la saisie utilisateur
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
 * TODO : Description 
 * @returns {{ allIngredients: [string], allAppliances: [string], allUstensils: [string] }} 
 */
export async function getAllValues() {

    const recipesInfo = await getRecipes()
    let allIngredients = [], allAppliances = [], allUstensils = [];

    recipesInfo.forEach(recipe => {
        allIngredients = [...new Set(textOptionsNormalizer(recipe.ingredients, allIngredients, true))];
        allUstensils = [...new Set(textOptionsNormalizer(recipe.ustensils, allUstensils))];
        allAppliances = [...new Set(textOptionsNormalizer([recipe.appliance], allAppliances))];
    });

    return { allIngredients, allAppliances, allUstensils };
}
/**
 * Uniformisation des noms des élements dans les tableaux 
 * @param {[string]} type 
 * @param {[string]} allTypes
 * @param {boolean} hasIngredient
 */
function textOptionsNormalizer(type, allTypes, hasIngredient = false) {

    type.forEach(element => {

        let normalizedType = hasIngredient ? element.ingredient.toLowerCase() : element.toLowerCase();
        normalizedType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
        allTypes.push(normalizedType);
    });
    return allTypes
}

// Instance de la classe FilterManager
const filterManager = new FilterManager();

// Initialisation des filtres
filterManager.initializeFilters();

// Ajouter les écouteurs d'événements pour les filtres
addFilterListener("searchBar_ingredient", "dropdown_ingredients");
addFilterListener("searchBar_appareils", "dropdown_appliances");
addFilterListener("searchBar_ustensiles", "dropdown_ustensils");