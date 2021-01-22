import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.list = [];
    }

    addItem(count, unit, ingredient){
        const newItem = {
            id : uniqid(),
            count : parseFloat(count),
            unit,
            ingredient
        }
        this.list.push(newItem);
        return newItem;
    }
    deleteItem(id){
        const index = this.list.findIndex(el => el.id === id);
        this.list.splice(index, 1);
    }
    updateCount(id, count){
        this.list.find(el => el.id === id).count = count;
    }
}