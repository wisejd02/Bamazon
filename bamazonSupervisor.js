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
        salesByDeptSearch();
        break;
        case "Create New Department":
        askDept();
        break;
        case "Exit":
        exitPrgm();
        break;
    }
    });
}

function salesByDeptSearch(){
    var query = "select *, sum((deptCost*-1) - Total_Sales) as Total_Profit from (SELECT departments.dept_id, products.dept_name, sum(products.product_sales) as Total_Sales, (departments.`overhead_cost`)as deptCost FROM products, departments where departments.dept_name = products.dept_name GROUP BY dept_name) mngmnt GROUP BY dept_name"
    var objItemList  = new itemList;
    connection.query(query, function(err, res) {
      if(err){
        console.log(err);
      }
    objItemList.printSalesReport(res);
    runBamazon();
    });
  }
  function addDept(name, cost){ 
    console.log("Inserting a new department...\n");
    var query = connection.query(
      "INSERT INTO departments SET ?",
      {
        dept_name: name,
        overhead_cost: cost
      },
      function(err, res) {
        console.log(res.affectedRows + " department created!\n");
        var objItemList  = new itemList;
        objItemList.updateDepts();
        runBamazon();
      });
      
  };

  function askDept(){
    var objItemList  = new itemList;
    console.log("Current Departments are:");
    console.log(objItemList.readDepts());
    inquirer
    .prompt({
    name: "Dept",
    type: "input",
    message: "Enter the name of the department you would like to add." 
    })
    .then(function(answer) {
        deptCost(answer.Dept);
    })
  }

  function deptCost(dept){
    inquirer
    .prompt({
    name: "Cost",
    type: "input",
    message: "Enter overhead cost of department" 
    })
    .then(function(answer) {
        var cost = Math.abs(parseInt(answer.Cost));
        if(cost){
            addDept(dept,cost);
        }else{
            console.log(`Please enter a number value!`);
            deptCost(dept);
        }
        
    })
  }

  function exitPrgm(){
    process.exit();
  }