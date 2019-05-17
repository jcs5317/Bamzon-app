if (err) throw err;
console.log("What jproducts would you like?");

for (var i = 0; i < results.length; i++) {
  console.table[("ID: " + results[i].item_id + 
  " PRODUCT NAME: " + results[i].product_name + 
  " DEPARTMENT: " + results[i].department_name + 
  " PRICE: $" + results[i].price + 
  " QUANTITY AVAILABLE: " + results[i].stock_quantity)];
}
inquirer.prompt(
  {
    type: "input",
    name: "item_id",
    message: "What is the ID of the product you would like to buy?"
  }).then(function (answer) {
    var item_id = parseInt(answer.item_id)


    for (var i = 0; i < results.length; i++) {
      if (results[i].item_id == answer.item_id) {
        var result = results[i];
        console.log("We have " + result.stock_quantity + " of " + result.product_name + " in stock for $" + result.price + " per Item");

        inquirer.prompt([
          {
            type: "input",
            name: "itemQuantity",
            message: "How many " + result.product_name + " would you like to buy?"
            
          }
        ])
        //val makes sure that the input is a number
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    }
  })