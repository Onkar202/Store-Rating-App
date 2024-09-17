const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // JWT for token generation and verification
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // The origin of your frontend
    credentials: true, // Allow cookies and credentials if needed
  })
);

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "---connection---link-----",
    {}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Image Store Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("store"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});

app.use("/images", express.static("upload/images"));

// Define User and Store models
const UserSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },
  userRatings: { type: Map, of: Number, default: {} },
  image: { type: String, required: true },
  password:{type:String,require:true}
});

const Store = mongoose.model("Store", StoreSchema);
const User = mongoose.model("User", UserSchema);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "1h", // Token expiration time
  });
};

// Middleware to verify token (authenticate user)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from Bearer token

  if (token == null)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Access denied. Invalid token." });

    req.user = user; // Attach user information to the request
    next();
  });
};

// Register User
app.post("/register", async (req, res) => {
  const { role, email, password, address, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      role,
      email,
      password: hashedPassword,
      address,
      name,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});
//login
// Login User and Store Owner
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    // Check the role and fetch the appropriate user from the correct collection
    if (role === "Store-Owner") {
      // If role is Store-Owner, query the Store collection
      user = await Store.findOne({ email });
    } else {
      // If role is Admin or Normal-User, query the User collection
      user = await User.findOne({ email, role });
    }

    // Log user details for debugging
    // console.log('User found:', user);

    // Check if the user exists and has a password field
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate JWT token
      const token = generateToken(user._id, role); // Generate token with user ID and role

      // Return the token and success status
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Login User and Issue Token

// Logout (Invalidate token on the client-side)
app.post("/logout", (req, res) => {
  // For token-based authentication, there's no server-side session to destroy.
  // Logout is handled client-side by deleting the token from localStorage or cookies.
  res.status(200).json({ message: "Logout successful" });
});

// Add Store (Protected Route)
app.post("/addstore", authenticateToken, async (req, res) => {
  const { name, email, address, image, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new store with the hashed password
    const newStore = new Store({
      name,
      email,
      address,
      image,
      password: hashedPassword, // Store hashed password
    });

    // Save the store in the database
    await newStore.save();

    res.status(201).json({ message: "Store added successfully!" });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: "Error adding store" });
  }
});


// Store List (Public Route)
app.get("/stores", async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Error fetching stores" });
  }
});

// User List (Protected Route)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Submit or Update Rating (Protected Route)
app.post("/stores/:id/rating", authenticateToken, async (req, res) => {
  const storeId = req.params.id;
  const { rating } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const userId = req.user.id;
    store.userRatings.set(userId, rating);

    const ratingsArray = Array.from(store.userRatings.values());
    store.rating =
      ratingsArray.reduce((sum, r) => sum + r, 0) / ratingsArray.length;
    store.rating_count = ratingsArray.length;

    await store.save();
    res.status(200).json(store);
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Error submitting rating" });
  }
});

// Get User Ratings (Protected Route)
app.get("/user-ratings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the authenticated user ID
    const stores = await Store.find(); // Get all the stores
    const responseData = [];

    // console.log("Authenticated user ID:", userId);

    stores.forEach((store) => {
      // console.log("Store userRatings:", store.userRatings);
      // console.log("UserID:", userId);
      // console.log("UserRating for store:", store.userRatings.get(userId)); // Use get method for Map

      responseData.push({
        storeId: store._id,
        storeName: store.name,
        overallRating: store.rating_count > 0 ? store.rating : "No rating",
        userRating: store.userRatings.get(userId) ?? null, // Use get method for Map
        userId: userId,
        rating_count: store.rating_count,
      });
    });

    console.log("API response data:", responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Error fetching user ratings" });
  }
});


// Remove Store (Protected Route)
app.delete("/stores/:id", authenticateToken, async (req, res) => {
  const storeId = req.params.id;

  try {
    const result = await Store.findByIdAndDelete(storeId);

    if (!result) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store removed successfully" });
  } catch (error) {
    console.error("Error removing store:", error);
    res.status(500).json({ error: "Error removing store" });
  }
});

// Change Password
app.post("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.id; // Get the authenticated user ID from the JWT token
    const user = await User.findById(userId); // Fetch the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Validate new password (you can customize the validation logic)
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be between 8 and 16 characters, and include at least one uppercase letter and one special character.",
      });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
});
app.post("/store/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.id; // Get the authenticated user ID from the JWT token
    const user = await Store.findById(userId); // Fetch the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Validate new password (you can customize the validation logic)
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be between 8 and 16 characters, and include at least one uppercase letter and one special character.",
      });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
});

// New API to get count of users, stores, and list of users who submitted ratings
app.get("/summary", authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Count total users
    const totalStores = await Store.countDocuments(); // Count total stores

    // Get all users who submitted ratings by checking the 'userRatings' map field in stores
    const storesWithRatings = await Store.find({
      userRatings: { $exists: true, $ne: {} },
    });

    // Extract user IDs from all stores' userRatings maps and ensure uniqueness
    let userIdsWithRatings = new Set();
    storesWithRatings.forEach((store) => {
      store.userRatings.forEach((value, key) => {
        userIdsWithRatings.add(key); // key is the user ID
      });
    });

    // Fetch user details of those who have submitted ratings
    const usersWhoRated = await User.find({
      _id: { $in: Array.from(userIdsWithRatings) },
    }).select("name email"); // Only select name and email fields

    // Return the summary data
    res.status(200).json({
      totalUsers,
      totalStores,
      usersWhoRated,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Error fetching summary data" });
  }
});

//store dashboard api
app.get("/store/dashboard", authenticateToken, async (req, res) => {
  try {
    const storeOwnerId = req.user.id; // Assume the token contains the store owner ID
    const store = await Store.findById(storeOwnerId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const usersWhoRated = [];
    for (let [userId, rating] of store.userRatings) {
      const user = await User.findById(userId).select("name email");
      if (user) {
        usersWhoRated.push({ ...user._doc, rating });
      }
    }

    const averageRating = store.rating;
    const ratingCount = store.rating_count;

    res.status(200).json({
      store,
      averageRating,
      ratingCount,
      usersWhoRated,
    });
  } catch (error) {
    console.error("Error fetching store owner dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});


//Store Owner Logout
app.post("/storeowner/logout", authenticateToken, (req, res) => {
  // Client-side will handle token removal
  res.status(200).json({ message: "Logout successful" });
});



// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
