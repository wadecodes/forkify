export const elements = {
    searchInput: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    resultList: document.querySelector(".results__list"),
    results: document.querySelector(".results"),
    resultPage: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shoppingList: document.querySelector(".shopping__list"),
    likesList: document.querySelector(".likes__list"),
    likesField : document.querySelector(".likes__field")
}

const elementStrings = {
    loader: "loader"
}

export const renderLoader = (parent) => {
    const loader = `
        <div class = ${elementStrings.loader}>
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader);
    }
}