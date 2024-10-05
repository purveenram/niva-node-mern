const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Configure CORS to allow requests from the React frontend
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from your React app
}));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((Error) => console.log(Error));

// Import user routes
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is Running !!!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
