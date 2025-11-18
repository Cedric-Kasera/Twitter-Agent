import express from "express";

const app = express();

// Health check route
app.get("/", (req, res) => {
    res.send("Twitter Agent is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
