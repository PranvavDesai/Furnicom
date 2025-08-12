const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");  // Import express-session
const loginRoutes = require("./routes/loginroutes");  // Import login routes
const adminRoutes = require("./routes/adminroutes");  // Import admin routes
const Furniture = require('./models/Furniture');  // Import the Furniture model

const cartRoutes = require("./routes/cartRoutes");  // Import the cart routes

const MongoStore = require('connect-mongo');


mongoose.set('strictQuery', true);
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/furnitureDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3001;

// Middleware for JSON and form-urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/furnitureDB', // Add your MongoDB connection string
        ttl: 14 * 24 * 60 * 60 // = 14 days
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 hours
}));

// Set paths for views and static files
const templatePath = path.join(__dirname, 'views');
const publicPath = path.join(__dirname, 'public');
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('landing'); // Render landing page
});

// Use the login routes
app.use('/', loginRoutes);

// Use the admin routes
app.use('/', adminRoutes);

app.use('/', cartRoutes);

// Home route
app.get('/home', async (req, res) => {
    try {
        // Fetch all furniture items from the database
        const furnitureItems = await Furniture.find();
        
        // Check if the items are being retrieved from the database
        // console.log("Furniture Items:", furnitureItems); 

        // Render the home page with the retrieved furniture items
        res.render('home', { 
            furniture: furnitureItems, 
            user: req.session.user || null // Pass the session user if available
        });
    } catch (error) {
        console.log("Error retrieving furniture items:", error);
        res.status(500).send('Error retrieving furniture items');
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



//const Cart = require('./models/cart');  // Import the Cart model
// Use the cart routes
// app.use(session(...)); // Session middleware


// Route to add product to the cart
// app.post('/add-to-cart/:id', async (req, res) => {
//     const productId = req.params.id;
//     const userId = req.session.user ? req.session.user._id : 'guest'; // Replace with actual user ID or guest

//     try {
//         // Find the user's cart
//         let cart = await Cart.findOne({ userId });

//         // If the cart does not exist, create a new one
//         if (!cart) {
//             cart = new Cart({ userId, items: [] });
//         }

//         // Check if the product is already in the cart
//         const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

//         if (productIndex > -1) {
//             // If product already exists, increase its quantity
//             cart.items[productIndex].quantity += 1;
//         } else {
//             // Otherwise, add the product to the cart
//             cart.items.push({ product: productId, quantity: 1 });
//         }
//         console.log(cart); // Add this before cart.save()

//         // Save the cart
//         await cart.save();

//         // Redirect to the cart page after adding the product
//         res.render('/cart');
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         res.status(500).send('Error adding to cart');
//     }
// });
