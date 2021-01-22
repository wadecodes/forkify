import axios from 'axios';

export class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try{
            const data = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            const recipe = data.data.recipe;          

            this.img = recipe.image_url;
            this.ingredients = recipe.ingredients;
            this.publisher = recipe.publisher;
            this.publisher_url = recipe.publisher_url;
            this.source_url = recipe.source_url;
            this.title = recipe.title;

            
        }catch(error){
            console.log(error);
            alert("Something went wrong :(");
        }
    }
    calcTime(){
        const period = Math.ceil(this.ingredients.length / 3);
        const time = period * 15;
        this.time = time;
    }
    calcServings(){
        this.servings = 4;
    }
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = (eval(arrIng[0].replace('-', '+'))).toFixed(1);
                } else {
                    count = (eval(arrIng.slice(0, unitIndex).join('+'))).toFixed(1);
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        const newServings = type === 'inc' ? this.servings + 1 : this.servings - 1;

        this.ingredients.forEach((el) => el.count *= (newServings / this.servings) );

        this.servings = newServings;
    }
}
