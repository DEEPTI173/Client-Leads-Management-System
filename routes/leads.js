const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all lead
router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    if(!page || !limit) {
        const sql = "SELECT * FROM leads ORDER BY id ASC"
        db.query(sql, (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).json({error: "Database error"});
            }
            return res.json({
                leads: results,
                currentPage: 1,
                totalPages: 1,
                totalRecords: results.length
            });
        });
    } else {
        const offset = (page - 1) * limit;
        db.query("SELECT COUNT(*) AS total FROM leads", (err, countResult) => {
            if(err) {
                console.error(err);
                return res.status(500).json({error: "Count query failed"});
            }
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            const dataSql = "SELECT * FROM leads ORDER BY id ASC LIMIT ? OFFSET ?";
            db.query(dataSql, [limit, offset], (err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({error: "Fetch query failed"});
                }
                res.json({
                    leads: results,
                    currentPage: page,
                    totalPages: totalPages,
                    totalRecords: totalRecords
                });
            });
        });
    }
});
// SEARCH LEADS 
router.get("/search", (req, res) => {
    const q = `%${req.query.q}%`;
    const sql = `SELECT * FROM leads WHERE name LIKE ? OR email LIKE ? OR source LIKE ? OR phone LIKE ? ORDER BY id DESC`;
    db.query(sql, [q, q, q, q], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message: "Search error"});
        }
        res.json(result);
    });
});
/* Add new lead */
router.post("/", (req, res) => {
    const {name, email, phone, source} = req.body;

    if(!name || !email || !source || !phone) {
        return res.status(400).json({message: "All fields requried"});
    }

    const sql = `INSERT INTO leads (name, email, source, phone) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, source, phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message:"Database error"});
        }
        res.json({message:"Lead added successfully"});
    });
});
/* Update lead status */
router.put("/:id", (req, res) => {
    console.log("BODY RECEVIED:", req.body);  //debug

    if(!req.body) {
        return res.status(400).json({message: "No body received"});
    }
    const id = req.params.id;
    const {name, email, source, status, notes, phone} = req.body;
    /*
    console.log("PUT HIT");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    res.json({
        message: "Lead updated successfully",
        id,
        name,
        email,
        source,
        phone
    }); */
    if (!name || !email || !source || !phone) {
        return res.status(400).json({message: "All fields are required"});
    }
    const sql = `UPDATE leads SET name= ?, email= ?, source= ?, phone= ? WHERE id= ?`;
    db.query(sql, [name, email, source, phone, id], (err, result) =>{
        if (err){
            console.error(err);
            return res.status(500).json({message: "Database Error"});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Lead not found"});
        }
        res.json({message: "Lead updated successfully"});
    }); 
});
/* Delete Lead */
router.delete("/:id", (req,res) =>{
    const id = req.params.id;

    const sql = "DELETE FROM leads WHERE id=?";
    db.query(sql, [id], (err) => {
        if(err) return res.status(500).json(err);
        res.json({message: "Lead deleted successfully"});
    });
});

module.exports = router;