var inquirer = require("inquirer");
var item = require("./item");
var itemList = require("./itemList");
var connect = require("./connect");

var bamazonConnect = new connect("bamazon");
var connection = bamazonConnect.connect();

 if(connection){
   runBamazon();
 } 
 function runBamazon() {
    inquirer
    .prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit"
    ]
    })
    .then(function(answer) {
    switch (answer.action) {
        case "View Product Sales by Department":
        productSearch();
        break;
        case "Create New Department":
        createNewDept();
        break;
        case "Exit":
        exitPrgm();
        break;
    }
    });
}

function productSearch(){
    var query = "SELECT * FROM products ORDER BY dept_name";
    var objItemList  = new itemList;
    connection.query(query, function(err, res) {
      if(err){
        console.log(err);
      }
      for (var i = 0; i < res.length; i++) {
        var productItem = new item(res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity, res[i].product_sales);
        objItemList.addToItemList(i, productItem);
        productItem.printItemInfo();
      }
        runBamazon();
    });
  }