// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: 'password',
	database: 'bamazon'
});

// promptManager function will present menu options to the manager and trigger logic for the manager
function promptManager() {
	
	// Prompt the manager to select an option from the list 
	inquirer.prompt([
		{
			name: 'option',
			type: 'list',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            filter: function (val) 
            {

                if (val === 'View Products for Sale') {
                    return 'sale';
                }
                else if (val === 'View Low Inventory') {
                    return 'lowInventory';
                }
                else if (val === 'Add to Inventory') {
                    return 'addInventory';
                }
                else if (val === 'Add New Product') {
                    return 'newProduct';
                }
                else {
                    // This case should be unreachable
                    console.log('ERROR: Unsupported operation!');
                    promptManager();
                }
            }    
		}
    ]).then(function(input) 
    {
        switch(input.option)
        {
            case "sale":
            displayInventory();
            break;

            case "lowInventory":
            lowInventory();
            break;

            case "addInventory":
            addInventory();
            break;
            
            case "newProduct":
            createNewProduct();
            break;

            default:
            // This case should be unreachable
            console.log('ERROR: Unsupported operation!');
            promptManager();
            break;
        }
	})
}

// displayInventory function will retrieve the current inventory from the database and display it for the user
function displayInventory() 
{
	// Construct queryStr to grab the products from the bamazon database
	queryStr = 'SELECT * FROM products';

	// Make the database query
    connection.query(queryStr, function(err, data) 
    {
		if (err) throw err;

        // Display the data to the user
		console.log('Existing Inventory: ');
		console.log('...................\n');

        // Variable to ouput the string data to the user for display
        var strOut = '';
        
        // Lopp through the products and grab all data and display it
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '    \n';
			strOut += 'Product Name: ' + data[i].product_name + '    \n';
			strOut += 'Department: ' + data[i].department_name + '    \n';
			strOut += 'Price: $' + data[i].price + '   \n';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

            // Show the products to the user
			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

// LowInventory function will display a list of products with the available quantity below 100
function lowInventory() 
{

	// Construct the database query string for quanity below 100
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';

	// Make the database query
    connection.query(queryStr, function(err, data) 
    {
		if (err) throw err;

		console.log('Low Inventory Items (below 100): ');
		console.log('................................\n');

        // A variable to output the string data to the user
        var strOut = '';
        
        // Loop through the products and find all with low inventory and grab them and store in the strOut variable
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '    \n';
			strOut += 'Product Name: ' + data[i].product_name + '   \n';
			strOut += 'Department: ' + data[i].department_name + '    \n';
			strOut += 'Price: $' + data[i].price + '    \n';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

            // display the products for the user with strOut
			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

// validateNumber makes sure that the user is supplying positive numbers
function validateNumber(value) 
{
    // Declare variables
    var int = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

    if (int && (sign === 1)) 
    {
		return true;
    } 
    else {
		return 'Please enter a whole number above zero.';
	}
}

// validateInputNumbers makes sure that the user is supplying only positive numbers for their inputs when addding a product
function validateInputNumbers(value) 
{
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

    if (number && positive) 
    {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

// addInventory function will guide the user to add more products to the inventory
function addInventory() 
{
	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateNumber,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			validate: validateNumber,
			filter: Number
		}
    ]).then(function(input)
     {
        // declare variables to grab data and store them 
		var item = input.item_id;
		var addQuantity = input.quantity;

		// Query database to confirm that the given item ID exists and to grab the data from the products
		var queryStr = 'SELECT * FROM products WHERE ?';

        // Make the connection
		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

            // If no valid Id then call addInventory function else update the inventory
            if (data.length === 0) 
            {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

            } 
            else {
                // declare variable to grab product data
				var productData = data[0];

				console.log('Updating Inventory...');

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

				// Update the inventory in the database
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

// createNewProduct will guide the user in adding a new product to the inventory
function createNewProduct() {

	// Prompt the user to enter information about the new product
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: validateInputNumbers
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateNumber
		}
    ]).then(function(input) 
    {
		
        // Display the new item being added to the inventory
		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create a query to insert the new data into the database
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the database
        connection.query(queryStr, input, function (error, results, fields) 
        {
			if (error) throw error;

            // displaye message to user letting them know product has been added
			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}

// runBamazon function will execute the main application logic
function runBamazon() 
{
	// Call the promptManager function for user input
	promptManager();
}

// Run the main application logic
runBamazon();