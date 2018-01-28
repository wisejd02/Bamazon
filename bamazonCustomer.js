var mysql = require("mysql");
var inquirer = require("inquirer");
var item = require("./item")

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    runBamazon();
  });
  
  function runBamazon() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Get all products",
          // "Find all artists who appear more than once",
          // "Find data within a specific range",
          // "Search for a specific song",
          // "Find artists with a top song and top album in the same year"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "Get all products":
            productSearch();
            break;
  
          // case "Find all artists who appear more than once":
          //   multiSearch();
          //   break;
  
          // case "Find data within a specific range":
          //   rangeSearch();
          //   break;
  
          // case "Search for a specific song":
          //   songSearch();
          //   break;
  
          // case "Find artists with a top song and top album in the same year":
          //   songAndAlbumSearch();
          //   break;
        }
      });
  }
  
  
  function productSearch(){
    var query = "SELECT * FROM products ORDER BY item_id";
    var objProductList = {};
    connection.query(query, function(err, res) {
      if(err){
        console.log(err);
      }
      for (var i = 0; i < res.length; i++) {
        var productItem = new item(res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity);
        objProductList[i] = productItem; 
        productItem.printItemInfo();
      }
      
      console.log(objProductList);
      userPrompt(objProductList);
    });
  }

  function userPrompt(objProductList) {
    var itmSelection =[];
    for (var idx in objProductList){
      itmSelection.push(objProductList[idx].id+" "+objProductList[idx].product +" "+objProductList[idx].price);
    }
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "Which item would you like to purchase?",
        choices: itmSelection
      })
      .then(function(answer) {
        console.log(answer.choice);
        var itemSelected = answer.choice.split(" ");
        console.log(itemSelected[0]);
        orderQty(objProductList, itemSelected[0]);
        
        // switch (answer.action) {
        //   case "Get all products":
        //     productSearch();
        //     break;
  
        //   case "Find all artists who appear more than once":
        //     multiSearch();
        //     break;
  
        //   case "Find data within a specific range":
        //     rangeSearch();
        //     break;
  
        //   case "Search for a specific song":
        //     songSearch();
        //     break;
  
        //   case "Find artists with a top song and top album in the same year":
        //     songAndAlbumSearch();
        //     break;
        //}
      });
  }

function orderQty(objProductList, itemSelectedId){
  var idx = parseInt(itemSelectedId) - 1;
  inquirer
          .prompt({
            name: "quantity",
            type: "input",
            message: "How many items would you like to purchase?"
          })
          .then(function(answer) {
            console.log(answer.quantity);
            var qtySelected = parseInt(answer.quantity);
            var qtyMax = parseInt(objProductList[idx].qty);
            console.log(qtyMax);
            if(qtySelected && qtySelected < qtyMax+1){
              ttlPrice = (parseFloat(objProductList[idx].price) * qtySelected).toFixed(2);
              console.log(`Your purchase total is : $${ttlPrice} ` ) 
              processOrder(qtySelected, qtyMax, itemSelectedId);
            }else{
              console.log(answer.quantity)
              console.log(`Please enter a quantity between 1 and ${qtyMax}`);
              orderQty(objProductList, itemSelectedId);
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
      console.log(`${res.affectedRows} products updated!\n`);
    }
  );

  // logs the actual query being run
  //console.log(query.sql);

}