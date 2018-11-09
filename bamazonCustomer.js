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
	password: '',
	database: 'Bamazon'
});

// validateNumber function will make sure user only uses positive numbers
function validateNumber(value) 
{
	var int = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

    if (int && (sign === 1)) 
    {
		return true;
	} else {
		return 'Please enter a whole number above zero.';
	}
}

// promptPurchase function will prompt user the quantity and item they wish to purchase
function promptPurchase() 
{
	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			validate: validateNumber,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			validate: validateNumber,
			filter: Number
		}
    ]).then(function(input) 
    {
        // Declare variables
		var item = input.item_id;
		var quantity = input.quantity;

		// Query bamazon database to confirm that the given item ID exists
		var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {item_id: item}, function(err, data) 
        {
			if (err) throw err;

			// If the user has selected an invalid item ID, will be empty and invaild
            if (data.length === 0) 
            {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

            } 
            else 
            {
                // Declare variable
				var productData = data[0];

				// If statement if the product is found to be in stock place the order.
                if (quantity <= productData.stock_quantity) 
                        {
					console.log('The product you requested is in stock! Placing order!');

					// Setting the query string to update the stock qty
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

					// Connecting to database and updating the inventory stock
                    connection.query(updateQueryStr, function(err, data) 
                    {
                        if (err) throw err;
                        
                        // Display message to user about the purchase if successful
						console.log('Your order has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");
                        
						// End the database connection
						connection.end();
					})
                } else 
                {
                    // Display message to user letting them know order can't be placed.
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

                    // Call the displayInventory function
					displayInventory();
				}
			}
		})
	})
}

// displayInventory  function will retrieve the current inventory from the database and output it to the console
function displayInventory() 
{

	
	// Cnstruct queryStr to grab the products from the bamazon databasel
	queryStr = 'SELECT * FROM products';

	// Make the database query
    connection.query(queryStr, function(err, data)
     {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

        // Declare variable to strOut to display a string for user
        var strOut = '';
        
        // A for loop displaying the products database in a pretty way
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	// Call the promptPurchase function to the user for item/quantity they would like to purchase
	  	promptPurchase();
	})
}

// Function to run the main application logic
function runBamazon() 
{
	
	// Call function displayInventory to call the available inventory
	displayInventory();
}

// A call to run the main application logic
runBamazon();