const express = require('express');
const router = express.Router()
module.exports = router;

const Task_MID = require("../middleware/Tasks_Mid");
const category_MID = require("../middleware/Category_Mid");

// Create
// =====================================================================================================================
router.get("/add", [category_MID.GetAllCategories], (req,res)=>{
    res.render("task_add", {
        categories: req.category_data,
        data :{},
    });
});
router.post("/add",[Task_MID.AddTask], (req, res) => { res.redirect("/task/list"); });
// =====================================================================================================================

// Read
// =====================================================================================================================
router.get("/list",[Task_MID.GetTasks, category_MID.GetCategoryName, category_MID.GetAllCategories],(req,res)=>{
    res.render("task_list",{
        page_title:"Tasks List",
        categories : req.category_data,
        category_name : req.category_name,
        task_data : req.task_data,
        filter_params : req.filter_params,
    });
});
// =====================================================================================================================