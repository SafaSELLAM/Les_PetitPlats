import { getAllValues } from "./filters.js";
import { getRecipes } from "./fetch.js";
import { attachEventListeners } from "./dropdown.js";
export class FiltersManager {
    constructor() {
        this.selected = {
            ingredients: [],
            appliances: [],
            ustensils: []
        };
    }

    // Créer un tag
    createTag(text, type) {
        const tagContainer = document.getElementById('tags-container');
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerHTML = `<p>${text}</p> <span>&times;</span> `;
        tagContainer.appendChild(tag);

        // Ajouter un gestionnaire d'événements pour supprimer le tag lorsqu'on clique dessus
        tag.addEventListener('click', () => {
            tag.remove();
            this.removeTag(text, type);
        });
    }

    addOption(text, type) {
        const listId = `list-${type}`;
        const list = document.getElementById(listId);
        const option = this.createOption(text, type);
        list.appendChild(option);
    }
    // Ajouter un tag aux filtres sélectionnés
    addTag(text, type) {
        this.selected[type].push(text);
    }

    // Retirer un tag des filtres sélectionnés
    removeTag(text, type) {
        const index = this.selected[type].indexOf(text);
        if (index !== -1) {
            this.selected[type].splice(index, 1);
            this.addTag(text, type);
            this.addOption(text, type);
            const listId = `list-${type}`;
            const list = document.getElementById(listId);
            const options = Array.from(list.getElementsByTagName('a'));
            options.sort((a, b) => a.textContent.localeCompare(b.textContent));
            // Réinitialiser la liste avec les options triées
            list.innerHTML = '';
            options.forEach(option => {
                list.appendChild(option);
            });
        }
    }

    // Créer une option de filtre
    createOption(text, type) {
        const option = document.createElement('a');
        option.textContent = text;
        option.addEventListener('click', () => {
            this.handleFiltersOptionClick(text, type);
        });
        return option;
    }

    // Gérer le clic sur une option de filtre
    handleFiltersOptionClick(text, type) {
        this.createTag(text, type);
        this.removeOption(text, type);
        this.addTag(text, type);
    }

    // Retirer une option de la liste de filtres
    removeOption(text, type) {
        const listId = `list-${type}`;
        const list = document.getElementById(listId);
        const options = list.getElementsByTagName('a');
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === text) {
                options[i].remove();
                break;
            }
        }
    }
    
    // Méthode pour initialiser les événements d'entrée pour les inputs de filtre
    initializeInputEvents() {
        const inputs = document.getElementsByClassName('filters-input');
        Array.from(inputs).forEach(input => {
            const inputId = input.id;
            const clearIcons = document.querySelectorAll(`.clear-cross-icon[data-id="${inputId}"]`);

            input.addEventListener('input', function () {
                let inputValue = this.value.trim();
                clearIcons.forEach(icon => icon.style.display = inputValue !== '' ? 'block' : 'none');
            });

            clearIcons.forEach(icon => {
                icon.addEventListener('click', function () {
                    document.getElementById(inputId).value = '';
                    icon.style.display = 'none';
                    this.initializeFilters();
                }.bind(this))
            });
        });
    }

    // Initialiser les filtres
    async initializeFilters() {
        try {
            const recipesInfo = await getRecipes()
            let allIngredients = [], allAppliances = [], allUstensils = [];
            let allItems = [];
            recipesInfo.forEach(recipe => {
                allItems = getAllValues(recipe, allIngredients, allUstensils, allAppliances);
            })
            this.addAllItemsToFiltersList(allItems, this);
            attachEventListeners();
            return allItems;
        } catch (error) {
            console.error(error);
        }
    }

    addAllItemsToFiltersList(allItems, element) {
        element.addOptionsToFiltersList(allItems["allIngredients"], 'list-ingredients', 'ingredients');
        element.addOptionsToFiltersList(allItems["allAppliances"], 'list-appliances', 'appliances');
        element.addOptionsToFiltersList(allItems["allUstensils"], 'list-ustensils', 'ustensils');
    }
    // Ajouter des options à la liste de filtres
    addOptionsToFiltersList(items, listId, type) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        items.sort();
        items.forEach(item => {
            const option = this.createOption(item, type);
            list.appendChild(option);
        });
    }
}

