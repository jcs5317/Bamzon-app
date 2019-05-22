//require modules for database and prompts
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
connection.connect(function (err) {
  if (err) {
    throw err;
  }
  else {
    console.log("connected as id: " + connection.threadId + "\n=================");
    //runApp function  
    startApp();
  }
});

//global variables used across functions 
var saleItems; //the key to show the user the available items for sale 

//get app to run 
function startApp() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    saleItems = res;
    // show table 
    console.table("\n");
    console.table(saleItems);
    console.table("\n");
    // wait .5 sec then prompt  
    setTimeout(function () { promptSale(res) }, 400);
  });
  // run the start function after the connection is made to prompt the user
}


function promptSale(products) {
  inquirer.prompt([
    {
      type: "rawlist",
      name: "name",
      choices: function () {
        var optionsIds = []
        for (var i = 0; i < products.length; i++) {
          optionsIds.push(products[i].product_name)
        }
        return optionsIds
        },

      message: "Enter product number you would like to buy"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like to buy?",
      //quantity validation
      validate: function (value) {
        if (isNaN(value) == false) {
          return true;
        } else {
          return false;
        }
      }
    }
  ])
    //answer function to select product and update quantity
    .then(function (answer) {
      var name = answer.name;
      var user_quantity = parseInt(answer.quantity);

      var id;
      var stock;
      var price;

     
      //loop through choices and break or stop from running
      for (var i = 0; i < products.length; i++) {
        if (products[i].product_name === name) {
          id = products[i].item_id;
          stock = products[i].stock_quantity;
          price = products[i].price;
          break;
        }
      }
      
      //condition to update stock of selected product
      if (user_quantity < stock) {
        var newStock = stock - user_quantity;
        connection.query("UPDATE products SET ? where ? ", [{
          stock_quantity: newStock
        },
        {
          item_id: id
        }
          // function to show purchase receipt in terminal 
        ], function (err, updatedItem) {
          if (err) throw err;
          if (updatedItem.affectedRows === 1) {
            console.log("\n___________________________")
            console.log("Bamazon")
            console.log("-----------------------------")
            console.log("Item:", name)
            console.log("Item quantity:", user_quantity)
            console.log("-----------------------------")
            console.log("sub-total: $", user_quantity * price)
            console.log("___________________________")
            console.log("Thank you for shopping!")
            console.log("___________________________\n");
            
            setTimeout(function(){ buyAgain()}, 400);
          }
        })
      } 
      else {
        // not enough stock to buy item, prompt user to do a different amount and start again
        console.log("There is not enough stock available, enter less quantity or make another selection.")
        
        startApp()
      }
    })
}
//function to continue shopping or stop session 
function buyAgain(){
  inquirer.prompt({
    type: "confirm",
    name: "buyAgain",
    message: 'Buy another "j" product?'
  })
    .then(function(answer){
      if(answer.buyAgain){
        startApp()
      } else {
        console.log("Shop again soon!")
        connection.end();
      }
    })
    .catch(function(err){
      throw err;
    })
}