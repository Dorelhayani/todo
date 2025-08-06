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
        page_title: "Add Task",
        data :{},
    });
});
router.post("/add",[Task_MID.AddTask], (req, res) => { res.redirect("/task/list"); });
// =====================================================================================================================

// Read
// =====================================================================================================================
router.get("/list",[Task_MID.GetTasks,Task_MID.GetTasksPageCounter ,category_MID.GetCategoryName, category_MID.GetAllCategories],(req,res)=>{
    res.render("task_list",{

        page_title:"Tasks List",
        categories : req.category_data,
        category_name : req.category_name[req.filter_params.category_id] || "All Categories",
        tasks : req.task_data,
        page: req.page,
        total_pages: req.total_pages,
        filter_params: req.filter_params,
    });
});

// =====================================================================================================================

// Read
// =====================================================================================================================
router.post("/isdone/:id",[Task_MID.HandleDone], (req,res)=>{ res.redirect("/task/list"); });
// =====================================================================================================================