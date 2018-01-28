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
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            productSearch();
            break;
          case "View Low Inventory":
            lowInventoySearch();
            break;
          case "Add to Inventory":
            addInventory();
            break;
          case "Add New Product":
            addProduct();
            break;
        }
      });
  }

  function productSearch(){
    var query = "SELECT * FROM products ORDER BY item_id";
    var objItemList  = new itemList;
    connection.query(query, function(err, res) {
      if(err){
        console.log(err);
      }
      for (var i = 0; i < res.length; i++) {
        var productItem = new item(res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity);
        objItemList.addToItemList(i, productItem);
        productItem.printItemInfo();
      }
      runBamazon();
    });
  }

  function lowInventoySearch(){
    var objItemList  = new itemList;
    var query = "SELECT * FROM products WHERE stock_quantity <5 ORDER BY item_id";
    var objItemList  = new itemList;
    connection.query(query, function(err, res) {
      if(err){
        console.log(err);
      }
      for (var i = 0; i < res.length; i++) {
        var productItem = new item(res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity);
        objItemList.addToItemList(i, productItem);
        productItem.printItemInfo();
      }
      runBamazon();
    });
  }

  function addInventory(){

  }

  function addProduct(){
      
  }