const express = require('express');
const router = express.Router()
module.exports = router;
const users_MID = require("../middleware/User_Mid");

// Create
// =====================================================================================================================
router.get("/add", (req,res)=>{ res.render("usrs_add",{ data: {} }); });
router.post("/add",[users_MID.AddUser], (req, res) => { res.redirect("/users/List"); });
// =====================================================================================================================


// Read
// =====================================================================================================================
router.get("/List",[users_MID.GetAllUsers],(req,res)=>{
    res.render("usrs_list",{
        page_title:"Users List",
        users : req.users_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});
// =====================================================================================================================


// Delete
// =====================================================================================================================
router.post("/Delete", [users_MID.DeleteUser] ,(req,res)=>{ res.redirect("/users/List"); })
// =====================================================================================================================


// Update
// =====================================================================================================================
router.get("/Edit/:id",[users_MID.GetOneUser], (req,res)=>{
    if(req.GoodOne){ res.render("usrs_add",{ data: req.one_user_data, }); }
    else res.redirect("/users/List"); });
router.post("/Edit/:id",[users_MID.UpdateUser], (req, res) => { res.redirect("/users/List"); });
// =====================================================================================================================