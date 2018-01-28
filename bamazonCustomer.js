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
          "View Products for Sale"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            productSearch();
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
      userPrompt(objItemList);
    });
  }

  function userPrompt(objList) {
    var obj = objList.objProductList;
    objList.makeSelectionList();
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "Which item would you like to purchase?",
        choices: objList.itmSelection
      })
      .then(function(answer) {
        console.log(`Your purchase selection is ${answer.choice}.`);
        var itemSelected = answer.choice.split(" ");
        orderQty(obj, itemSelected[0]);
      });
  }

function orderQty(obj, itemSelectedId){
  var idx = parseInt(itemSelectedId) - 1;
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many items would you like to purchase?"
      })
    .then(function(answer) {
      var qtySelected = parseInt(answer.quantity);
      var qtyMax = parseInt(obj[idx].qty);
      if(qtySelected && qtySelected < qtyMax+1){
        ttlPrice = (parseFloat(obj[idx].price) * qtySelected).toFixed(2);
        console.log(`You purchased ${qtySelected} ${obj[idx].product}.\n Your purchase total is : $${ttlPrice} ` ) 
        processOrder(qtySelected, qtyMax, itemSelectedId);
      }else{
        console.log(`Please enter a quantity between 1 and ${qtyMax}`);
        orderQty(obj, itemSelectedId);
      }
      
    });
}

function processOrder(qtySelected, qtyMax, itemSelectedId){
  var newQty = qtyMax - qtySelected;
  console.log(`Updating Bamazon quantities...\n`);
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQty
      },
      {
        item_id: itemSelectedId
      }
    ],
    function(err, res) {
      console.log(`${res.affectedRows} products updated!\n Thank you Come Again!\n Now exiting.`);
      process.exit();
    }
  );

  // logs the actual query being run
  //console.log(query.sql);
  
}