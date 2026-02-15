const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./config/db"); // Mysql Connection

app.use(cors());
app.use(express.json());

const leadRoutes = require("./routes/leads");  // routes
app.use("/api/leads", leadRoutes); 

// Test route
app.get("/", (req, res)=>{
    res.send('API is running');
});
/*
app.post('/api/leads', (req, res) =>{
    res.send('POST API working');
});

app.post('/api/leads', (req,res) =>{
    res.json({
        message: 'Lead route hit successfully',
        data: req.body
    });
}); */
// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});