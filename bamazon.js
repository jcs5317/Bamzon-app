var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazondb"
});

// connect to the mysql server and sql database
connection.connect(function(err){
  if(err){
    throw err; 
  }
  else{
      console.log("connected as id: " + connection.threadId +"\n=================");
      //runApp function  
      startApp();
  }
});

//global variables used across functions 
var products; //the object to show the user the available items for sale 
//var product_id;// the id the user chooses

//get app to run 
function startApp(){

  connection.query("SELECT * FROM products", function(err,productList_item){
      products = productList_item;
      setTimeout(function(){console.table(products);});
  });
// run the start function after the connection is made to prompt the user
}
inquirer.prompt([{
  type: "input",
  name: "id",
  message: "What is the id of the product you would like to buy?"
}
])