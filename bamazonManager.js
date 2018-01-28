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
          "Add New Product",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            productSearch(false);
            break;
          case "View Low Inventory":
            lowInventoySearch();
            break;
          case "Add to Inventory":
            productSearch(true);
            break;
          case "Add New Product":
            addProduct();
            break;
        case "Exit":
            exitPrgm();
            break;
        }
      });
  }

  function productSearch(addInv){
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
      if(!addInv){
        runBamazon();
      }else{
        userPrompt(objItemList);
      }
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

  function userPrompt(objList) {
    var obj = objList.objProductList;
    objList.makeSelectionList();
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "Which item would you like to add inventory to?",
        choices: objList.itmSelection
      })
      .then(function(answer) {
        console.log(`You chose to add inventory to: ${answer.choice}.`);
        var itemSelected = answer.choice.split(" ");
        addQty(obj, itemSelected[0]);
      });
  }

  function addQty(obj, itemSelectedId){
    var idx = parseInt(itemSelectedId) - 1;
    inquirer
      .prompt({
        name: "quantity",
        type: "input",
        message: "How many items would you like to add?"
        })
      .then(function(answer) {
        var qtyAdd = parseInt(answer.quantity);
        if(qtyAdd){
          var newQty = (parseInt(obj[idx].qty) + qtyAdd);
          console.log(`You are adding ${qtyAdd} ${obj[idx].product}.\n Your inventory total is : ${newQty} ` ) 
          processOrder(newQty, itemSelectedId);
        }else{
          console.log(`Please enter a whole number value!`);
          addQty(obj, itemSelectedId);
        }
        
      });
  }

  function processOrder(newQty, itemSelectedId){
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
        runBamazon();
        
      }
    ); 
    // logs the actual query being run
    //console.log(query.sql);
  }

  function addProduct(){
    inquirer
      .prompt({
        name: "product",
        type: "input",
        message: "Enter Product Name:"
        })
      .then(function(answer) {
          if(answer.product){
            var productItem = new item('', answer.product, 'dept_name', 'price', 'stock_quantity');
            productItem.depts();
            chooseDept(productItem.depts(), answer.product);
          }
      });
  };
function chooseDept(arrDept, product){
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "Which item would you like to add inventory to?",
        choices: arrDept
      })
      .then(function(answer) {
        console.log(`You chose to add ${product} to the ${answer.choice} department.`);
        price(product, answer.choice)
      });
}
  function exitPrgm(){
    process.exit();
  }

  function price(product, dept){
    inquirer
      .prompt({
        name: "price",
        type: "input",
        message: `Enter Price for ${product}:`
        })
      .then(function(answer) {
          if(parseFloat(answer.price)){
            var price = parseFloat(answer.price).toFixed(2);
            qty(product, dept, price);
          }else{
              console.log(`Please enter a positive value!`);
              price(product, dept);
          }
      });
  };

  function qty(product, dept, price){
    inquirer
      .prompt({
        name: "qty",
        type: "input",
        message: `Enter qty for ${product}:`
        })
      .then(function(answer) {
          if(parseInt(answer.qty)){
              var qty = parseInt(answer.qty);
            addItem(product, dept, price, qty)
          }else{
              console.log(`Please enter a positive value!`);
              qty(product, dept, price);
          }
      });
  };

  function addItem(product, dept, price, qty){
    console.log(`Updating Bamazon quantities...\n`);
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
        product_name: product,
        dept_name: dept,
        price: price,
        stock_quantity: qty
        },
        function(err, res) {
        console.log(res.affectedRows + " product inserted!\n");
        
        runBamazon();
        }
    );
    //console.log(query.sql);
  }