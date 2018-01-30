var fs = require('fs');
var connect = require("./connect");

var bamazonConnect = new connect("bamazon");
var connection = bamazonConnect.connect();

var ItemList = function (){
    this.objProductList = {},
    this.itmSelection =[]
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

ItemList.prototype.printSalesReport = function(obj){
    
    for (var i = 0; i < obj.length; i++) {
        console.log(
        `Dept ID: ${obj[i].dept_id} || Dept Name: ${obj[i].dept_name} || Total Sales: ${obj[i].Total_Sales} || Overhead: ${obj[i].deptCost} || Total Profit: ${obj[i].Total_Profit}`
        );
    }
   
}

ItemList.prototype.updateDepts = function(){
   var arrDepts = [] 
    var query = "SELECT dept_name FROM departments"
    connection.query(query, function(err, res) {
        if(err){
          console.log(err);
        }
        fs.writeFileSync('./depts.txt',"")
        for (var idx in res){
            arrDepts.push(res[idx].dept_name);
            if(idx == res.length-1){
                fs.appendFileSync('./depts.txt',res[idx].dept_name);
            }else{
                fs.appendFileSync('./depts.txt',res[idx].dept_name+'\n');
            }
            
        }
        //console.log(arrDepts);
        
    });
    
}

ItemList.prototype.readDepts = function(){
    var data = fs.readFileSync('./depts.txt', 'utf8');
        var arrDepts = data.split("\n");
        return arrDepts;
}

module.exports = ItemList;