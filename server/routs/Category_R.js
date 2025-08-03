const express = require('express');
const router = express.Router()
module.exports = router;
const Category_MID = require("../middleware/Category_Mid");

// Create
// =====================================================================================================================
router.get("/add", (req,res)=>{
    res.render("category_add",{
        data: {},
        page_title:"Add Category",
    });
});
router.post("/add",[Category_MID.AddCategory], (req, res) => { res.redirect("/category/list"); });
// =====================================================================================================================


// Read
// =====================================================================================================================
router.get("/list",[Category_MID.GetAllCategories],(req,res)=>{
    res.render("category_list",{
        page_title:"Categories",
        categories: req.category_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});
// =====================================================================================================================


// Delete
// =====================================================================================================================
router.post("/delete", [Category_MID.DeleteCategory] ,(req,res)=>{ res.redirect("/category/list"); })
// =====================================================================================================================


// Update
// =====================================================================================================================
router.get("/edit/:id",[Category_MID.GetOneCategory], (req,res)=>{
    if(req.GoodOne){ res.render("category_add",{ data: req.one_category_data,});}
    else res.redirect("/category/list"); });
router.post("/edit/:id",[Category_MID.UpdateCategory], (req, res) => { res.redirect("/category/list"); });
// =====================================================================================================================

