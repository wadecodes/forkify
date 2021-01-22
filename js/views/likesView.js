import { elements } from "./base";
import {limitTitle} from "./searchView"

export function toggleLike(isLiked){
    const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
    
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
}
export function toggleButton(nLikes){
    elements.likesField.style.visibility = nLikes > 0 ? 'visible' : 'hidden';
}

export function addLikeUI(item){
    const markup = `
    <li>
    <a class="likes__link" href="#${item.id}">
        <figure class="likes__fig">
            <img src="${item.img}" alt="${item.id}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitTitle(item.title)}</h4>
            <p class="likes__author">${item.author}</p>
        </div>
    </a>
</li>
    `;
    elements.likesList.insertAdjacentHTML("afterbegin",markup);
}
export function deleteLikeUI(id){
    
    const item = document.querySelector(`.likes__link[href*="${id}"]`).parentNode;
    item.parentNode.removeChild(item);
}