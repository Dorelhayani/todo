// Add Task
// =====================================================================================================================
async function AddTask(req, res, next){
    let user_id = req.user_id;
    let category_id = (req.body.category_id !== undefined) ? Number(req.body.category_id) :  "" ;
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let due_date = (req.body.due_date !== undefined) ? addSlashes(req.body.due_date) : "";
    let done = 1;

    let Query = "INSERT INTO task";
    Query +="(`user_id`, `category_id`, `name`, `description`, `due_date`, `done`) ";
    Query +=" VALUES ";
    Query +=`( '${user_id}' ,'${category_id}', '${name}', '${description}', '${due_date}', '${done}')`;

    console.log(Query);
    req.ok = false;
    const promisePool = db_pool.promise();
    let rows = [];
    try{
        [rows] = await promisePool.query(Query);
        req.ok = true;
    }
    catch (err){ console.log(err) }
    next();
}
// =====================================================================================================================

// Update Task
// =====================================================================================================================
async function UpdateTask(req, res, next){
    let id = parseInt(req.params.id);
    let name = addSlashes(req.body.name);
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let due_date = (req.body.due_date !== undefined) ? addSlashes(req.body.due_date) : "";

    if(id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let Query = `UPDATE task SET name='${name}', description = '${description}', due_date ='${due_date}'  WHERE id='${id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query);}
    catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================

// Get Task with nice_date format
// =====================================================================================================================
async function GetAllTasks(req,res,next){
    let free_txt = (req.query.free_txt !== undefined) ? addSlashes(req.query.free_txt) : "" ;
    let task_id = (req.query.id !== undefined) ? addSlashes(req.query.id) : "" ;
    req.filter_params = {
        free_txt:free_txt,
        task_id:task_id,
    };

    let Query="SELECT *,DATE_FORMAT(due_date,'%d-%m-%y' ) AS nice_date FROM task";
    let wh = "";

    if(free_txt !== ""){
        wh += (wh === "")? " WHERE " : " AND ";
        wh += `description LIKE '%${free_txt}%'`
    }

    Query += wh;
    Query += " ORDER BY due_date DESC"

    const promisePool = db_pool.promise();
    let rows=[];
    req.task_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.task_data=rows;
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================

// Get Task - page counter , 10 tasks per page
// =====================================================================================================================
async function GetTasksPageCounter(req,res,next){
    let page = 0;
    let rowPerPage = 10;
    if(req.query.p !== undefined) { page = parseInt(req.query.p); } //
    req.page = page;

    let rows = [];
    let Query = "SELECT COUNT(id) as cnt FROM task";
    const promisePool = db_pool.promise();
    let total_rows = 0;
    try {
        [rows] = await promisePool.query(Query);
        total_rows =rows[0].cnt;
    } catch (err){ console.log(err); }
    req.total_pages= Math.floor(total_rows / rowPerPage);

    // Query = "SELECT * FROM task";
    Query = `SELECT *, DATE_FORMAT(due_date, '%d-%m-%y') AS nice_date FROM task`;
    Query += ` LIMIT ${page * rowPerPage},${rowPerPage} `;
    req.task_data  = [];
    try {
        [rows] = await promisePool.query(Query);
        req.task_data  = rows;
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================

// Get One Task
// =====================================================================================================================
async function GetOneTask(req,res,next){
    let id = parseInt(req.params.id);
    if(id === NaN ||(id <= 0) ){
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`SELECT * FROM task WHERE id = '${id}' `;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_task_data=[];
    try {
        [rows] = await promisePool.query(Query);
        if(rows.length > 0){ req.task_data = rows[0]; }
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================

// Delete Task
// =====================================================================================================================
async function DeleteTask(req, res, next){
    let id = parseInt(req.body.id);
    if(id > 0) {
        let Query =`DELETE FROM task WHERE id = '${id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try{ [rows] = await promisePool.query(Query); }
        catch (err){ console.log(err) }
    }
    next();
}
// =====================================================================================================================

// handle Done
// =====================================================================================================================
async function HandleDone(req,res,next){
    let id = parseInt(req.params.id);
    let done = req.body.done? 1 : 0 ;
    const promisePool = db_pool.promise();
    let Query = `UPDATE task SET done='${done}' WHERE id='${id}'`;
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.task_data = rows;
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================

module.exports = { AddTask,GetAllTasks,GetTasksPageCounter,UpdateTask,DeleteTask,GetOneTask,HandleDone }