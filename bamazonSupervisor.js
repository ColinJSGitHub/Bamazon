var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,

  // Your username
  user: "root",

  // Your password is always root for the root directory
  password: "root",
  database: "bamazon"
});

// Inquirer prompt which gives you the Supervisor level functions as choices.
var supervisorPrompt = function() {
  inquirer.prompt([{
    name: "choice",
    type: "rawlist",
    message: "Select store Supervisor-level function:",
    choices: ["View Product Sales by Department", "Add a New Department"]
  }]).then(function(val){
    if(val.choice == "View Product Sales by Department"){
      supervisorList();
    }

    if(val.choice == "Add a New Department"){
      addDepartment();
    }
  })
}


// Uses the console.table npm package to spit out beautiful looking tables, no effort required!
var supervisorList = function (){
	connection.query("SELECT * FROM departments", function(err,res){
		console.table(res);
		supervisorPrompt();
	})
}

// Function for creating new Departments in the mySQL database, adding to the departments table.
var addDepartment = function(){
	inquirer.prompt([{
		name: "newDepartment",
		type: "input",
		message: "What is the name of the new department?"
	},{
		name: "overhead",
		type: "input",
		message: "What is the overhead cost of the department?"
	}]).then(function(val){
		connection.query("INSERT INTO departments (department_name, over_head_costs, total_sales, total_profits) VALUES ('" + val.newDepartment + "'," + val.overhead + ", 0," +-val.overhead + ");", function(err,res){
			if(err)throw err;
			console.log("Added New Department: " + val.newDepartment);
			supervisorList();
		})
	})
}
supervisorPrompt();