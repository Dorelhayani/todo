// Create
// =====================================================================================================================
async function AddTask(req, res, next){
    let user_id = req.user_id;
    console.log("user_id is:" , user_id);
    let category_id = (req.body.category_id !== undefined) ? Number(req.body.category_id) :  "" ;
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let due_date = (req.body.due_date !== undefined) ? addSlashes(req.body.due_date) : "";
    let done = 1;

    let Query = "INSERT INTO task";
    Query +="(`user_id`, `category_id`, `description`, `due_date`, `done`) ";
    Query +=" VALUES ";
    Query +=`( '${user_id}' ,'${category_id}', '${description}', '${due_date}', '${done}')`;

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

// Read
// =====================================================================================================================
async function GetTasks(req,res,next){
    let free_txt = (req.query.free_txt !== undefined) ? addSlashes(req.query.free_txt) : "" ;
    let category_id = (req.query.category_id !== undefined) ? addSlashes(req.query.category_id) : "" ;
    req.filter_params = {
        free_txt:free_txt,
        category_id:category_id,
    };

    let Query="SELECT *,DATE_FORMAT(due_date,'%d-%m-%y' ) AS nice_date FROM task";
    let wh = "";

    if(free_txt !== ""){
        wh += (wh === "")? "WHERE" : "AND";
        wh += `(description LIKE ${free_txt})`
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

module.exports = { AddTask,GetTasks }