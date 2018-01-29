var fs = require('fs');
var Item = function (id, product, dept, price, qty, sold){
    this.id = id,
    this.product = product,
    this.dept = dept,
    this.price = price,
    this.qty = qty,
    this.sold = sold,
    this.deptsArr = []
}

Item.prototype.printItemInfo = function(){
    console.log(
`item id: ${this.id} || product: ${this.product} || dept: ${this.dept} || price: ${this.price} || quantity: ${this.qty}`
    );
}
Item.prototype.depts = function(){
    var data = fs.readFileSync('./depts.txt', 'utf8');
        var arrDepts = data.split("\n");
        return arrDepts;
}

module.exports = Item;