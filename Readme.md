# E-Commerce Application with Cart Functionality

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Cart Functionality](#cart-functionality)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Conclusion](#conclusion)

## Project Overview

This project is an e-commerce platform where users can browse products and manage their shopping cart. The platform allows users to add items to their cart, update quantities, and remove items. The backend is built with Node.js, Express, and MongoDB, while the frontend utilizes React.

## Technologies Used

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB (for storing cart data and products)
- **Other Libraries**: Mongoose, Axios, dotenv

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecommerce-cart.git
   cd ecommerce-cart
   ```

2. **install dependencies:**

    - For the backend:
        ```bash
            cd backend
            npm install
        ```

3. **For the frontend:**

    - For the frontend
        ```bash
            cd frontend
            npm install
        ```

3. **Create a `.env` file in the `backend` directory and set up your environment variables:**

    ```bash
    MONGO_URI=your_mongo_db_connection_string
    PORT=7000
    JWT_SECRET_KEY = 'YOUR_KEY
    ```


## Cart Functionality
The application handles typical e-commerce cart functionalities:

1. **Add Item to Cart:** Users can add a product to their cart with a specified quantity.
2. **Update Item Quantity:** If the item is already in the cart, users can update its quantity.
3. **Remove Item from Cart:** Users can remove items from their cart.
### Example Workflow:
- Adding an item to the cart:
    - Endpoint: **POST** `/api/cart`


## API Endpoints
### API Endpoints for Cart Operations:
- **POST** `/api/cart:` Add a new item to the cart.

- **PUT** `/api/cart:` Update an existing item in the cart.

- **DELETE** `/api/cart:` Remove an item from the cart.

- **GET** `/api/cart:` Fetch the user's cart items.

## Running the Application
1. Start the backend server:
    ```bash
        cd backend
        node server.js
    ```

2. Start the frontend server:
    ```bash
        cd frontend
        npm start
    ```

3. Navigate to the app in your browser at `http://localhost:3000`.


## Conclusion
This e-commerce application features a functional cart management system, allowing users to add, update, and remove items effectively. The backend is designed to handle various cart operations seamlessly, and the frontend provides an interactive user experience.
