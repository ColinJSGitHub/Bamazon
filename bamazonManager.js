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

// Connects to the server, if it successfully connects, console.logs "Successfully connected to the Bamazon Server!" then calls initialList function.
connection.connect(function(err) {
  if (err) throw err;
  console.log("Successfully connected to the Bamazon Server! Manager Level");
  initialList();
})

// Stolen from my bamazonCustomer.js file: we can use this function to view all products for sale (spits out the table with all of the info, then calls the inquirer prompt for Managerial level functions)
var initialList = function () {
  connection.query("SELECT * FROM products", function(err,res) {
      console.log("Complete Inventory Table Below:")
      console.log("- - - - - - - - - - - -");
        for (var i = 0; i < res.length; i++) {
         console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity in Stock: " + res[i].stock_quantity);
        }

      console.log("- - - - - - - - - - - -");

  managerPrompt(res);
  });

  
}


// managerPrompt is the function that uses Inquirer prompts (a defined list) to give us the managerial functions as options. View products for sale seems a little redundant though; the initialList function is called by all of the other functions, and when the file first loads.
var managerPrompt = function(res) {
  inquirer.prompt([{
    name: "choice",
    type: "rawlist",
    message: "Select store inventory management function:",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }]).then(function(val){
    if(val.choice == "View Products for Sale"){
      initialList();
    }

    if(val.choice == "View Low Inventory"){
      lowInventory();
    }

    if(val.choice == "Add to Inventory"){
      addInventory(res);
    }

    if(val.choice == "Add New Product"){
      newProduct();
    }
  })
}


// The lowInventory function is pretty simple; all we have to do is take the code from the "Initial List" function, change it to select products that have an inventory lower than 5, and spit out a table with the results. We then call the initialList function again to show the full list and prompt for the next Managerial level function.
var lowInventory = function() {
  console.log("Low Inventory Function called");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5" , function(err,res) {
      console.log("Low Inventory List Below:");
      console.log("- - - - - - - - - - - -");
        for (var i = 0; i < res.length; i++) {
         console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity in Stock: " + res[i].stock_quantity);
        }

      console.log("- - - - - - - - - - - -");
  });

  initialList();
}


// Function for adding additional inventory to an existing product; will throw an error if you try to add inventory to a product that does not yet exist, and will tell you to use the newProduct function if you'd like to add a new type of product.
var addInventory = function(res) {
  console.log("Adding more to Inventory");

  inquirer.prompt([{
      name: "product_name",
      type: "input",
      message: "What is the name of the product we are adding inventory for?"
  },{
      name: "addAmount",
      type: "input",
      message: "How much new inventory would you like to add for this product?"
  }]).then(function(val){
    for( i = 0 ; i < res.length; i++){

      if(res[i].product_name == val.product_name){

        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + val.addAmount + " WHERE item_id = " + res[i].item_id + ";", function (err,res){
          if(err)throw(err);
          if(res.affectedRows == 0) {
            console.log("This product does not currently exist in the database. Choose option ADD NEW PRODUCT to enter this product into the database.");
            initialList();
          } else {
            console.log("You have successfully added " + val.addAmount + " " + val.product_name + "s to the total inventory!");
            initialList();
          }          
        })
      }
    }
  })
}


// function for creating a new product and updating the products table with this new entry.
var newProduct = function() {
  console.log("New Product being added to Inventory!");

    inquirer.prompt([{
      name: "product_name",
      type: "input",
      message: "What is the name of this new product?"
    },{
      name: "department_name",
      type: "input",
      message: "What department is this product for?",
    },{
      name: "price",
      type: "input",
      message: "What is the price of the item? Use plain numbers only, no spaces or letters."
    },{
      name: "stock_quantity",
      type: "input",
      message: "How many of this new item is available for sale? Use plain numbers only, no spaces or letters."    
    }]).then(function(val){
      connection.query("INSERT INTO products (product_name,department_name,price, stock_quantity) VALUES ('" + val.product_name + "','" + val.department_name + "'," + val.price + "," + val.stock_quantity+");", function(err, res){

        if(err)throw err;
        console.log(val.product_name + " has been added to the Bamazon Server/Inventory!");

        initialList();
      })
    })
}