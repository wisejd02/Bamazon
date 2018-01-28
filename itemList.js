var ItemList = function (key, obj){
    this.key = key,
    this.obj = obj,
    this.objProductList = {};
    
}

ItemList.prototype.addToItemList = function(){
    this.objProductList[this.key] = this.obj;
}

ItemList.prototype.printList = function(){
    console.log(this.objProductList);
}

module.exports = ItemList;