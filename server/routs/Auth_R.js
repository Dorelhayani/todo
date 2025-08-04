const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/User_Mid");
router.get("/login",(req, res)=>{ res.render("login_page",{}); });

router.post("/login", [user_Mid.CheckLogin], (req, res) => {
    if(req.validUser) res.redirect("/users/list");
    else res.redirect("/auth/login");
});