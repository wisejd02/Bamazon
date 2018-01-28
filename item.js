var fs = require('fs');
var Item = function (id, product, dept, price, qty){
    this.id = id,
    this.product = product,
    this.dept = dept,
    this.price = price,
    this.qty = qty,
    this.deptsArr = []
}

Item.prototype.printItemInfo = function(){
    console.log(
`item id: ${this.id} || product: ${this.product} || dept: ${this.dept} || price: ${this.price} || quantity: ${this.qty}`
    );
}
Item.prototype.depts = function(){
    var arrDepts = [];
    fs.readFile('depts.txt', 'utf8',(err, data) => {
       
		if (err) throw err;
        //this.depts = data.split("\n");
        arrDepts = data.split("\n");
        //console.log(arrDepts);
        console.log(arrDepts.length+" length");
        for(var i = 0; i<arrDepts.length; i++){
            console.log("arrDepts "+arrDepts[i]);
            this.deptsArr[i] = arrDepts[i];
            console.log("this "+this.deptsArr[i])
        }
        
        //return arrDepts;
        //console.log(this.deptsArr)
      });
      
}

module.exports = Item;