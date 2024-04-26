import { getRecipes } from "./fetch.js";
import { FiltersManager } from "./FiltersManager.js";
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
let allRecipes;
let allItems;
let filteredDisplayedRecipes;

const processAsync = async () => {
    allRecipes = await getRecipes();
    // Initialisation des filtres
    allItems = await filterManager.initializeFilters();
    filterManager.initializeInputEvents();
    filteredDisplayedRecipes = allRecipes;

    // Écouter l'événement personnalisé pour la création d'un tag
    document.addEventListener('tagCreated', function (event) {
        // Récupérer les données du tag à partir de l'événement
        const tags = event.detail.allTags;
        document.getElementById('recipe-cards').innerHTML = "";
        const recipesFiltersByTags = subFilterRecipes(filteredDisplayedRecipes, tags);
        updateDisplayRecipes(recipesFiltersByTags)
    });

    document.addEventListener('tagDeleted', function (event) {
        const currentTags = event.detail.allTags;
        document.getElementById('recipe-cards').innerHTML = "";
        const recipesFiltersByTags = subFilterRecipes(filteredDisplayedRecipes, currentTags);
        updateDisplayRecipes(recipesFiltersByTags)

    })
}
processAsync();

// Ajouter les écouteurs d'événements pour les filtres
addFiltersListener("searchbar-ingredient", "dropdown-ingredients");
addFiltersListener("searchbar-appliances", "dropdown-appliances");
addFiltersListener("searchbar-ustensils", "dropdown-ustensils");

/**
 * Gère l'affichage des recettes après la création ou suppression de filtres
 * @param {array} recipes : recettes à filtrer
 * @param {array} tags : tags présents sur la pages après ajout ou suppression
*/
function subFilterRecipes(recipes, tags) {
    let allIngredientsItems;
    let allUstensilsItems;
    let allAppliancesItems;
    const filteredRecipes = [];
    const ingredientsTags = tags.filter(function (item) {
        return item.type === "ingredients"
    })
    const appliancesTags = tags.filter(function (item) {
        return item.type === "appliances"
    })
    const ustensilsTags = tags.filter(function (item) {
        return item.type === "ustensils"
    })

    recipes.forEach(recipe => {
        const allIncluded = [];

        if (ingredientsTags.length !== 0) {
            allIngredientsItems = recipe["ingredients"].map((ingredient) => ingredient.ingredient.toLowerCase())
            // Utilisation de la fonction pour les ingredientsTags
            const isIncludedIngredients = areAllIncluded(ingredientsTags, allIngredientsItems);
            allIncluded.push(isIncludedIngredients)
        } if (appliancesTags.length !== 0) {
            allAppliancesItems = [recipe["appliance"].toLowerCase()];
            // Utilisation de la fonction pour les appliancesTags
            const isIncludedAppliances = areAllIncluded(appliancesTags, allAppliancesItems);
            allIncluded.push(isIncludedAppliances)
        } if (ustensilsTags.length !== 0) {
            allUstensilsItems = recipe["ustensils"];
            // Utilisation de la fonction pour les ustensilsTags
            const isIncludedUstensils = areAllIncluded(ustensilsTags, allUstensilsItems);
            allIncluded.push(isIncludedUstensils)
        }
        if (!allIncluded.includes(false)) {
            filteredRecipes.push(recipe);
        }
    });
    return filteredRecipes;
}

// Fonction pour vérifier si tous les éléments d'un tableau sont inclus dans un autre tableau
function areAllIncluded(tags, items) {
    const included = tags.map(tag => tag.text.toLowerCase());
    return included.every(tag => items.includes(tag));
}



// Gestion barre de filtre principale
async function globalSearch() {
    const userResearch = this.value.toLowerCase().trim();
    if (userResearch.length >= 3) {
        isAllRecipesLoaded = false
        document.getElementById('recipe-cards').innerHTML = "";
        filteredDisplayedRecipes = filterRecipes(userResearch, allRecipes);
        updateDisplayRecipes(filteredDisplayedRecipes)
    } else {
        if (!isAllRecipesLoaded) {
            document.getElementById('recipe-cards').innerHTML = "";
            allRecipes.forEach(recipe => {
                displayRecipes(recipe)
            });
            isAllRecipesLoaded = true
            filterManager.addAllItemsToFiltersList(allItems, filterManager);
            filteredDisplayedRecipes = allRecipes;
        }
        document.getElementById('number-recipes').innerText = allRecipes.length + " recettes";
    }
}
const mainSearchInput = document.getElementById('main-searchbar');
const submitBtn = document.getElementById('form_submit');
submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
})

let isAllRecipesLoaded = false
mainSearchInput.addEventListener('input', globalSearch)



/**
 * Gère l'affichage des recettes après le filtres des recettes
 * @param {array} recipes : recettes à afficher
*/
function updateDisplayRecipes(recipes) {
    let allIngredients = [], allAppliances = [], allUstensils = [];
    if (recipes.length === 0) {
        const inputMainSearch = document.getElementById('main-searchbar').value;
        document.getElementById('recipe-cards').innerHTML = `<div class="no-recipe-found manrope">Aucune recette ne contient '${inputMainSearch}'</div>`
    } else {

        for (const recipe of recipes) {
            displayRecipes(recipe);
            const allItems = getAllValues(recipe, allIngredients, allUstensils, allAppliances)

            filterManager.addAllItemsToFiltersList(allItems, filterManager);

        }
    }
    document.getElementById('number-recipes').innerText = recipes.length + " recettes";
}



