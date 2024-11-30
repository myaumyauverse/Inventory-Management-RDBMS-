// Function to fetch and display products from the backend
async function populateProductsTable() {
    try {
        // Fetch data from the backend (GET request to /products)
        const response = await fetch("http://localhost:3000/products");
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error("Error fetching products");
        }

        // Convert the response to JSON format
        const products = await response.json();
        
        // Get the table body element where product rows will be added
        const tableBody = document.getElementById("product-table").getElementsByTagName("tbody")[0];
        
        // Clear any existing rows in the table
        tableBody.innerHTML = "";
        
        // Check if there are no products
        if (products.length === 0) {
            console.log("No products found.");
            return;
        }

        // Iterate over each product and create a new row for the table
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.item_name}</td>
                <td>${product.quantity}</td>
                <td>${product.unit_price}</td>
                <td>${product.location}</td>
                <td>${product.manufacturer}</td>
                <td>${product.stock_status}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load products");
    }
}

// Function to fetch and display vendors from the backend
async function populateVendorsTable() {
    try {
        // Fetch data from the backend (GET request to /vendors)
        const response = await fetch("http://localhost:3000/vendors");

        // Check if the response is OK
        if (!response.ok) {
            throw new Error("Error fetching vendors");
        }

        // Convert the response to JSON format
        const vendors = await response.json();

        // Get the table body element where vendor rows will be added
        const tableBody = document.getElementById("vendor-table").getElementsByTagName("tbody")[0];

        // Clear any existing rows in the table
        tableBody.innerHTML = "";

        // Iterate over each vendor and create a new row for the table
        vendors.forEach(vendor => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vendor.vendor_name}</td>
                <td>${vendor.contact_number}</td>
                <td>${vendor.email_id}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load vendors");
    }
}

// Function to fetch and display purchase orders from the backend
async function populatePurchaseOrdersTable() {
    try {
        // Fetch data from the backend (GET request to /purchase-orders)
        const response = await fetch("http://localhost:3000/purchase-orders");

        // Check if the response is OK
        if (!response.ok) {
            throw new Error("Error fetching purchase orders");
        }

        // Convert the response to JSON format
        const orders = await response.json();

        // Get the table body element where purchase order rows will be added
        const tableBody = document.getElementById("purchase-order-table").getElementsByTagName("tbody")[0];

        // Clear any existing rows in the table
        tableBody.innerHTML = "";

        // Iterate over each purchase order and create a new row for the table
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.vendor_id}</td>
                <td>${order.po_date}</td>                  
                <td>${order.vendor_name}</td>
                <td>${order.status}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load purchase orders");
    }
}

// Function to fetch and display shipments from the backend
async function populateShipmentsTable() {
    try {
        // Fetch data from the backend (GET request to /shipments)
        const response = await fetch("http://localhost:3000/shipments");

        // Check if the response is OK
        if (!response.ok) {
            throw new Error("Error fetching shipments");
        }

        // Convert the response to JSON format
        const shipments = await response.json();

        // Get the table body element where shipment rows will be added
        const tableBody = document.getElementById("shipment-table").getElementsByTagName("tbody")[0];

        // Clear any existing rows in the table
        tableBody.innerHTML = "";

        // Iterate over each shipment and create a new row for the table
        shipments.forEach(shipment => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${shipment.shipment_number}</td>
                <td>${shipment.po_no}</td>
                <td>${shipment.shipment_date}</td>
                <td>${shipment.shipment_status}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load shipments");
    }
}

// Function to handle the form submission for adding a new product
async function handleAddProductForm(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get the form values
    const itemName = document.getElementById("item-name").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const unitPrice = parseFloat(document.getElementById("unit-price").value);
    const location = document.getElementById("location").value;
    const manufacturer = document.getElementById("manufacturer").value;

    // Determine stock status based on quantity
    const stockStatus = quantity > 0 ? "In Stock" : "Out of Stock";

    // Send a POST request to the backend to add a new product
    try {
        const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item_name: itemName,
                quantity: quantity,
                unit_price: unitPrice,
                location: location,
                manufacturer: manufacturer,
                stock_status: stockStatus
            })
        });

        // Check if the product was added successfully
        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        // Show success message
        alert("Product added successfully!");

        // Refresh the products table
        populateProductsTable();

        // Reset the form after submission
        document.getElementById("add-product-form").reset();
    } catch (error) {
        console.error(error);
        alert("Failed to add product");
    }
}

// Function to remove duplicate products based on item_name
async function removeDuplicates() {
    try {
        // Fetch all products from the backend
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();

        // Check for duplicates based on item_name
        const uniqueProducts = [];
        const seen = new Set();

        products.forEach(product => {
            if (!seen.has(product.item_name)) {
                uniqueProducts.push(product);
                seen.add(product.item_name);
            }
        });

        // Send a request to update the backend with unique products
        await fetch("http://localhost:3000/products/remove-duplicates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uniqueProducts)
        });

        // Refresh the products table
        populateProductsTable();

        alert("Duplicate products removed successfully!");
    } catch (error) {
        console.error("Error removing duplicates:", error);
        alert("Failed to remove duplicates.");
    }
}

// Event listener for the form submission to add a product
document.getElementById("add-product-form").addEventListener("submit", handleAddProductForm);

// Event listener for the remove duplicates button
document.getElementById("remove-duplicates-btn").addEventListener("click", (event) => {
    event.preventDefault();
    removeDuplicates();
});

// Call these functions when the page loads to populate the tables with data
document.addEventListener("DOMContentLoaded", () => {
    populateProductsTable();
    populateVendorsTable();
    populatePurchaseOrdersTable();
    populateShipmentsTable();
});