import { getAllValues } from "./filters.js";
import { attachEventListeners } from "./dropdown.js";
export class FilterManager {
    constructor() {
        this.selected = {
            ingredients: [],
            appliances: [],
            ustensils: []
        };
    }

    // Créer un tag
    createTag(text, type) {
        const tagContainer = document.getElementById('tags_container');
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.textContent = text;
        tagContainer.appendChild(tag);

        // Ajouter un gestionnaire d'événements pour supprimer le tag lorsqu'on clique dessus
        tag.addEventListener('click', () => {
            tag.remove();
            this.removeTag(text, type);
        });
    }

    addOption(text, type) {
        const listId = `list_${type}`;
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
        }
    }

    // Créer une option de filtre
    createOption(text, type) {
        const option = document.createElement('a');
        option.textContent = text;
        option.addEventListener('click', () => {
            this.handleFilterOptionClick(text, type);
        });
        return option;
    }

    // Gérer le clic sur une option de filtre
    handleFilterOptionClick(text, type) {
        this.createTag(text, type);
        this.removeOption(text, type);
        this.addTag(text, type);
    }

    // Retirer une option de la liste de filtres
    removeOption(text, type) {
        const listId = `list_${type}`;
        const list = document.getElementById(listId);
        const options = list.getElementsByTagName('a');
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === text) {
                options[i].remove();
                break;
            }
        }
    }

    // Initialiser les filtres
    async initializeFilters() {
        try {
            const { allIngredients, allAppliances, allUstensils } = await getAllValues();
            this.addOptionsToFilterList(allIngredients, 'list_ingredients', 'ingredients');
            this.addOptionsToFilterList(allAppliances, 'list_appliances', 'appliances');
            this.addOptionsToFilterList(allUstensils, 'list_ustensils', 'ustensils');
            attachEventListeners();
        } catch (error) {
            console.error(error);
        }
    }

    // Ajouter des options à la liste de filtres
    addOptionsToFilterList(items, listId, type) {
        const list = document.getElementById(listId);
        items.forEach(item => {
            const option = this.createOption(item, type);
            list.appendChild(option);
        });
    }
}

