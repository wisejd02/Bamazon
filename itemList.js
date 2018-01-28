var ItemList = function (){
    this.objProductList = {};
    this.itmSelection =[];
    
}

ItemList.prototype.addToItemList = function(key, obj){
    this.objProductList[key] = obj;
}

ItemList.prototype.printList = function(){
    console.log(this.objProductList);
}

ItemList.prototype.makeSelectionList = function(){
    var obj = this.objProductList;
    for (var idx in obj){
        this.itmSelection.push(obj[idx].id+" "+obj[idx].product +" "+obj[idx].price);
      }
      //console.log(this.itmSelection);
      
}

module.exports = ItemList;