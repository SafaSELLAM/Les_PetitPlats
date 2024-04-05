// Gestion du dropDown des iltres secondaires
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const isOpen = dropdown.classList.contains('show');
    const chevron = dropdown.previousElementSibling.querySelector('.fa-chevron-down');
    // Fermer tous les autres menus ouverts sauf celui actuel
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach(function (otherDropdown) {
        if (otherDropdown.id !== dropdownId) {
            otherDropdown.classList.remove('show');
            otherDropdown.previousElementSibling.querySelector('.fa-chevron-down').classList.remove('chevronIcon');
        }
    });

    // Ouvrir ou fermer le menu actuel
    dropdown.classList.toggle('show', !isOpen);
    chevron.classList.toggle('chevronIcon', !isOpen);
    chevron.classList.toggle('chevronReturn', true);
}
//regroupement des eventListener sur les boutons pour les appeller après chargement des éléments 
export function attachEventListeners() {
    // selection des boutons filtres
    let dropbtns = document.getElementsByClassName('btnContainer');

    //  ajout d'un écouteur d'eventListener
    for (let dropbtn of dropbtns) {
        dropbtn.addEventListener("click", function () {  // utilisation function régulière pour utiliser le this plus bas
            toggleDropdown(this.getAttribute('data-dropdown'));
        });
    }
}

export function closeMenu() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const chevron = document.querySelectorAll('.fa-chevron-down')
    dropdowns.forEach(function (dropdown, index) {
        dropdown.classList.remove('show');
        chevron[index].classList.remove('chevronIcon');
    });
}

document.addEventListener('click', function (event) {
    const target = event.target;
    // Fermer le menu si on clique en dehors du dropdown ou sur un bouton de toggle
    if (!target.classList.contains('dropbtn') && !target.closest('.dropdown-content')) {
        closeMenu();
    }
});