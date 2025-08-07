async function AddTask(req, res, next){
    let user_id = parseInt(req.user_id);
    let category_id = (req.body.category_id !== undefined) ? Number(req.body.category_id) :  "" ;
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let due_date = (req.body.due_date !== undefined) ? addSlashes(req.body.due_date) : "";
    let done = 0;

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

async function UpdateTask(req, res, next){
    let id = parseInt(req.params.id);
    let user_id = parseInt(req.user_id);
    let name = addSlashes(req.body.name);
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let due_date = (req.body.due_date !== undefined) ? addSlashes(req.body.due_date) : "";

    if(id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let Query = `UPDATE task SET name='${name}', description = '${description}', due_date ='${due_date}'  WHERE id='${id}' AND user_id = '${user_id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query);}
    catch (err) { console.log(err);}
    next();
}

async function GetOneTask(req,res,next){
    let id = parseInt(req.params.id);
    let user_id = parseInt(req.user_id);
    if(id === NaN ||(id <= 0) ){
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`SELECT * FROM task WHERE id = '${id}' AND user_id = '${user_id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_task_data=[];
    try {
        [rows] = await promisePool.query(Query, [id, req.user_id]);
        if(rows.length > 0){ req.task_data = rows[0]; }
    } catch (err) { console.log(err);}
    next();
}

async function DeleteTask(req, res, next){
    let id = parseInt(req.body.id);
    let user_id = parseInt(req.user_id);
    if(id > 0) {
        let Query =`DELETE FROM task WHERE id = '${id}' AND user_id = '${user_id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try{ [rows] = await promisePool.query(Query); }
        catch (err){ console.log(err) }
    }
    next();
}

async function HandleDone(req,res,next){
    let id = parseInt(req.params.id);
    let user_id = parseInt(req.user_id);
    let done = req.body.done? 1 : 0 ;
    const promisePool = db_pool.promise();
    let Query = `UPDATE task SET done='${done}' WHERE id='${id}' AND user_id = '${user_id}'`;
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.task_data = rows;
    } catch (err) { console.log(err);}
    next();
}
async function HandleFilteredTasks(req, res, next) {
    const promisePool = db_pool.promise();

    let filters = ["user_id = ?"];
    let params = [req.user_id];
    req.filter_params = {};

    if (req.query.done !== undefined && req.query.done !== "-1") {
        filters.push("done = ?");
        params.push(parseInt(req.query.done));
        req.filter_params.done = parseInt(req.query.done);
    } else {
        req.filter_params.done = -1;
    }

    if (req.query.category_id !== undefined && req.query.category_id !== "-1") {
        filters.push("category_id = ?");
        params.push(parseInt(req.query.category_id));
        req.filter_params.category_id = parseInt(req.query.category_id);
    } else { req.filter_params.category_id = -1; }

    const page = req.query.p !== undefined ? parseInt(req.query.p) : 0;
    const rowPerPage = 10;
    req.page = page;

    let whereClause = filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

    let countQuery = `SELECT COUNT(*) as cnt FROM task ${whereClause}`;
    let [countRows] = await promisePool.query(countQuery, params);
    req.total_pages = Math.floor(countRows[0].cnt / rowPerPage);

    let dataQuery = `
        SELECT *, DATE_FORMAT(due_date, '%d-%m-%Y') AS nice_date 
        FROM task 
        ${whereClause} 
        ORDER BY due_date DESC 
        LIMIT ?, ?
    `;
    params.push(page * rowPerPage, rowPerPage);

    try {
        const [rows] = await promisePool.query(dataQuery, params);
        req.task_data = rows;
    } catch (err) {
        console.error(err);
        req.task_data = [];
    }

    next();
}

module.exports = { AddTask,UpdateTask,DeleteTask,GetOneTask,HandleDone,HandleFilteredTasks }