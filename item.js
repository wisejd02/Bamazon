var Item = function (id, product, dept, price, qty){
    this.id = id,
    this.product = product,
    this.dept = dept,
    this.price = price,
    this.qty = qty
}

Item.prototype.printItemInfo = function(){
    console.log(
`item id: ${this.id} || product: ${this.product} || dept: ${this.dept} || price: ${this.price} || quantity: ${this.qty}`
    );
}


module.exports = Item;