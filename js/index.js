// Global app controller
import Search from "./models/Search";
import {elements, renderLoader, removeLoader} from "./views/base";
import * as SearchView from "./views/searchView";
import {Recipe} from "./models/Recipe";
import * as RecipeView from "./views/recipeView";
import List from "./models/List";
import * as ListView from "./views/listView";
import Likes from "./models/Likes";
import * as LikesView from "./views/likesView";

const state = {

};
window.s = state;
/////////////////////////////////////////////////////////////////////////////////
//                                SEARCH MODULE                                //
/////////////////////////////////////////////////////////////////////////////////
async function controlSearch() {
    // 1. Get query from the view.
    const query = SearchView.getInput();
    if (query) {
        //    2. New search object and add to state.
        state.search = new Search(query);
        //    3. Prepare UI for result.
        SearchView.clearInput();
        SearchView.clearLists();
        renderLoader(elements.results);
        //    4. Search for recipes.
        try {
            await state.search.getResults();
            //    5. Render result on UI.
            removeLoader();
            SearchView.displayResults(state.search.result);
            // console.log(state.search.result);
        } catch (err) {
            console.log(err);
            alert("Error searching recipe :(")
        }
    }
};

elements.searchForm.addEventListener("submit", e => {
    //prevents default reload
    e.preventDefault();
    controlSearch();
});

elements.results.addEventListener("click", (e) => {
    //matches the closest element to the btn-inline class
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        SearchView.clearLists();
        SearchView.displayResults(state.search.result, goToPage);
    }
});

/////////////////////////////////////////////////////////////////////////////////
//                                RECIPE MODULE                                //
/////////////////////////////////////////////////////////////////////////////////

async function controlRecipe() {

    //  1. Get id from url.
    const id = window.location.hash.replace('#', "");
    //  3. Prepare UI for result.
    if (id) {
        RecipeView.clearRecipe();
        renderLoader(elements.recipe);
        state.recipe = new Recipe(id);

        //HIGHLIGHT THE ACTIVE RECIPE
        if (state.search) SearchView.highlightSelected(id);

        //  2. New recipe object and add to state.
        try {
            await state.recipe.getRecipe();
            //  Calculate servings and timing
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();
            //  5. Render result on UI.
            // console.log(state.recipe);
            removeLoader();
            RecipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            // console.log(state.recipe);   
        } catch (error) {
            console.log(error);
            alert("Error processing recipe :(");
        }
    }
}
// array of two different events to loop
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', (e) => {
    if (e.target.matches('.btn-dec, .btn-dec *')) {
        // update the serving quantity
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            RecipeView.updateServingsUI(state.recipe.ingredients, state.recipe.servings);
        }
    } else if (e.target.matches('.btn-inc, .btn-inc *')) {
        state.recipe.updateServings('inc');
        RecipeView.updateServingsUI(state.recipe.ingredients, state.recipe.servings);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //adds item to the shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //like button in the recipeview is clicked
        controlLike();
    }
});


/////////////////////////////////////////////////////////////////////////////////
//                                LIST MODULE                                //
/////////////////////////////////////////////////////////////////////////////////

function controlList() {
    // create new list if there is no list
    if (!state.list) state.list = new List;

    // add items to the list
    state.recipe.ingredients.forEach((el) => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        ListView.addItem(item);
    });
}

elements.shoppingList.addEventListener('click', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete , .shopping__delete *')) {
        // shopping list delete is clicked
        state.list.deleteItem(id);
        ListView.deleteItem(id);
    } else if (e.target.matches('.shopping__count')) {
        // shopping list count is clicked
        const count = document.querySelector('.shopping__count--value').value;
        state.list.updateCount(id, count);
    }
});
/////////////////////////////////////////////////////////////////////////////////
//                                LIKE MODULE                                //
/////////////////////////////////////////////////////////////////////////////////

window.addEventListener('load',()=>{
    state.likes = new Likes;
    state.likes.readStorage();
    LikesView.toggleButton(state.likes.getNumLikes());
    state.likes.likes.forEach(el => LikesView.addLikeUI(el));
})

function controlLike(){
    if(!state.likes) state.likes = new Likes;
        const currentID = state.recipe.id;
        if(!state.likes.isLiked(currentID)){
            //the item is not in the liked list
            //add the like to the state
            const newLike = state.likes.addLike(
                currentID,
                state.recipe.title,
                state.recipe.publisher,
                state.recipe.img
            );
            //toggle the like button
                LikesView.toggleButton(state.likes.getNumLikes());
                LikesView.toggleLike(state.likes.isLiked(currentID));
            //add the like to the ui list
                LikesView.addLikeUI(newLike);

        }else{
            //the item is in the liked list
            //remove the item from the state like list
            state.likes.deleteLike(currentID);
               //toggle the like button
               LikesView.toggleButton(state.likes.getNumLikes());
               LikesView.toggleLike(state.likes.isLiked(currentID));
            // remove the like from the ui list
            LikesView.deleteLikeUI(currentID);
        }
}