const express = require('express');
const router = express.Router()
module.exports = router;
const users_MID = require("../middleware/User_Mid");
router.get("/add", (req,res)=>{ res.render("usrs_add",{ data: {} }); });
router.post("/add",[users_MID.AddUser], (req, res) => { res.redirect("/auth/home"); });
router.get("/list",[users_MID.GetAllUsers],(req,res)=>{
    res.render("usrs_list",{
        page_title:"Users List",
        users : req.users_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});

router.post("/delete", [users_MID.DeleteUser] ,(req,res)=>{ res.redirect("/users/list"); })
router.get("/edit/:id",[users_MID.GetOneUser], (req,res)=>{
    if(req.GoodOne){ res.render("usrs_add",{ data: req.one_user_data, }); }
    else res.redirect("/users/list"); });
router.post("/edit/:id",[users_MID.UpdateUser], (req, res) => { res.redirect("/users/list"); });
