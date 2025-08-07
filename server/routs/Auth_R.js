const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/User_Mid");
router.get("/login",(req, res)=>{ res.render("login_page",{}); });
router.post("/login", [user_Mid.CheckLogin], (req, res) => {
    if(req.validUser) res.redirect("/auth/home");
    else res.redirect("/auth/login");
});
router.get("/home",user_Mid.isLogged, (req, res) => {
    const name = req.name || "Guest";
    res.render("home_page", { name });
});
