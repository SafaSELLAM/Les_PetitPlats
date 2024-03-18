// import { FilterManager } from "./main.js";
import { attachEventListeners } from "./dropdown.js";
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

// function createOption(text, type) {
//     const option = document.createElement('a');
//     option.text = text;
//     option.addEventListener('click', () => {
//         createTag(text, type);
//         option.classList.add('hide_options')
//         closeMenu();
//     });
//     return option;
// }

// function addOptionsToFilterList(items, listId, type) {
//     const list = document.getElementById(listId);
//     items.forEach(item => {
//         const option = createOption(item, type);
//         list.appendChild(option);
//     });
// }

// // Créé les tags quand un filtre est selectionné
// /**
//  * @param {string} type correspond à ingredient, ustensils ou appliances
//  * @param {string} text correspond à la valeur de l'élément sélectionné
//  */
// function createTag(text, type) {
//     const tagContainer = document.getElementById('tags_container');
//     const tag = document.createElement('div');
//     tag.classList.add('tag');
//     tag.textContent = text;
//     tagContainer.appendChild(tag);

//     // Ajouter un gestionnaire d'événements pour supprimer le tag lorsqu'on clique dessus
//     tag.addEventListener('click', () => {
//         tag.remove();
//         const listOptions = document.querySelectorAll(`#list_${type} a`);
//         listOptions.forEach(option => {
//             if (option.textContent === text) {
//                 option.classList.remove('hide_options')
//             }
//         });
//     });
// }
// // Ajoute les options aux filtres sur la page HTML

// async function addOptionsToFilters() {
//     try {
//         const { allIngredients, allAppliances, allUstensils } = await getAllValues();
//         addOptionsToFilterList(allIngredients, 'list_ingredients', 'ingredients');
//         addOptionsToFilterList(allAppliances, 'list_appliances', 'appliances');
//         addOptionsToFilterList(allUstensils, 'list_ustensils', 'ustensils');
//         // Après avoir ajouté les options, attacher les écouteurs d'événements
//         attachEventListeners();
//     } catch (error) {
//         console.error(error);
//     }
// }
// // Appeler la fonction pour ajouter les options aux filtres
// addOptionsToFilters();

// //appel fonction qui ajoute les eventListeners
// addFilterListener("searchBar_ingredient", "dropdown_ingredients");
// addFilterListener("searchBar_appareils", "dropdown_appliances");
// addFilterListener("searchBar_ustensiles", "dropdown_ustensils");



// Instance de la classe FilterManager
const filterManager = new FilterManager();

// Initialisation des filtres
filterManager.initializeFilters();

// Ajouter les écouteurs d'événements pour les filtres
addFilterListener("searchBar_ingredient", "dropdown_ingredients");
addFilterListener("searchBar_appareils", "dropdown_appliances");
addFilterListener("searchBar_ustensiles", "dropdown_ustensils");