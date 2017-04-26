var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,

  // Your username
  user: "root",

  // Your password is always root for the root directory
  password: "root",
  database: "bamazon"
});

// Connects to the server, if it successfully connects, console.logs "Successfully connected to the Bamazon Server!" then calls the initialList function.
connection.connect(function(err) {
  if (err) throw err;
  console.log("Successfully connected to the Bamazon Server!");
  initialList();
})


// initialList function displays the table of products from the database and calls the purchasePrompt function with the results
// which is the JSON object of the results. (by using SELECT * FROM products we selected everything in the products table in the bamazon database)
var initialList = function () {
	connection.query("SELECT * FROM products", function(err,res) {
	      console.log("- - - - - - - - - - - -");

     	  for (var i = 0; i < res.length; i++) {
       	 console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity in Stock: " + res[i].stock_quantity);
      	}

        console.log("- - - - - - - - - - - -");
  purchasePrompt(res);
	});

  
}

// purchasePrompt function initializes the prompt via inquirer that will use our inputs (the ID number of the product we would like to buy and the quantity we want to purchase), then updates the mySQL server and table to reflect this purchase. Console.logs what a successful purchase, then displays the remaining inventory and the total price of transaction (price per product * quantity purchased). If you try to purchase too much of an item or an ID that doesn't exist, the function will console.log a message to that effect then call itself to retry the prompts.
var purchasePrompt = function(res) {
    
  inquirer.prompt({
    name: "inventoryCheck",
    type: "input",
    message: "Which product would you like to buy? Use ID number. To exit, press the E key.",
  }).then(function(answer) {
    var correct = false;

    if(answer.inventoryCheck.toUpperCase()=="E"){
      process.exit();
    }

    for(var i = 0; i < res.length; i++){

      if(res[i].item_id == answer.inventoryCheck){
        correct = true;
        var product = answer.inventoryCheck;
        var id= i;
        inquirer.prompt({
          type: "input",
          name: "quantityBought",
          message: "How many would you like to purchase?",
          validate: function(value){
            if (isNaN(value)==false){
                return true;
              } else {
                return false;
              }
            }
          }).then(function(answer){
            if((res[id].stock_quantity - answer.quantityBought) > 0){
              connection.query("UPDATE products SET stock_quantity =" + (res[id].stock_quantity - answer.quantityBought) + " WHERE item_id=" + product, function(err, res2){

                // Section added for BamazonSupervisor functions: updates the product_sales column of the specific product in question, and then updates the total_sales column in the departments table based on the sale completed. Then updates the total profits column for the respective department in the departments table.
                connection.query("UPDATE products SET product_sales = product_sales + " + (answer.quantityBought * res[id].price) + " WHERE item_id = " + res[id].item_id + ";");
                connection.query("UPDATE departments SET total_sales = total_sales + " + (answer.quantityBought * res[id].price) + " WHERE department_name = '" + res[id].department_name + "';");
                connection.query("UPDATE departments SET total_profits = total_profits + " + (answer.quantityBought * res[id].price) + " WHERE department_name = '" + res[id].department_name + "';");

                console.log("Product Purchased!");
                console.log("Remaining " + res[id].product_name + "s:" + (res[id].stock_quantity - answer.quantityBought));
                console.log("Total Purchase Price: $" + (answer.quantityBought * res[id].price));
                initialList();

              })
            } else {
              console.log("Not enough " + res[id].product_name + "s available! Try again.");
              purchasePrompt(res);
            }
          })

      }
    }
    
    if (i == res.length && correct==false){
      console.log("Not a valid selection! Try again.");
      purchasePrompt(res);
    }
  })
};