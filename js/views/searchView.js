import {elements} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchForm.value = "";
};

export const clearLists = () => {
    elements.resultList.innerHTML = "";
    elements.resultPage.innerHTML = "";
};

export const highlightSelected = (id) => {
    const arr = Array.from(document.querySelectorAll(".results__link"));
    arr.forEach(el => {
        el.classList.remove("results__link--active");
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add("results__link--active");
};


export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length < 17) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const displayElement = (el) => {
    const html = `
                    <li>
                        <a class="results__link" href="#${el.recipe_id}">
                            <figure class="results__fig">
                                <img src="${el.image_url}" alt="Test">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitTitle(el.title)}</h4>
                                <p class="results__author">${el.publisher}</p>
                            </div>
                        </a>
                    </li>
    `;
    elements.resultList.insertAdjacentHTML("beforeend", html);
};

/* <button class="btn-inline results__btn--"  */
const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${(type === 'prev') ? page - 1 : page + 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${(type === 'prev') ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${(type === 'prev') ? page - 1 : page + 1}</span>
    </button>
`;
const displayButtons = (results, page, resPerPage) => {

    const pages = Math.ceil(results.length / resPerPage);

    let buttons;
    if (page === 1 && pages > 1) {
        buttons = createButtons(page, 'next');
    } else if (page > 1 && page < pages) {
        buttons = `${createButtons(page, 'prev')}
        ${createButtons(page, 'next')}`;
    } else if (page === pages && page > 1) {
        buttons = createButtons(page, 'prev');
    }

    elements.resultPage.insertAdjacentHTML("afterbegin", buttons);
};

export const displayResults = (results, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    results.slice(start, end).forEach(el => {
        displayElement(el);
    });
    displayButtons(results, page, resPerPage);
};