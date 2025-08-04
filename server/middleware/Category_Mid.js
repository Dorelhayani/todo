// Create
// =====================================================================================================================
async function AddCategory(req, res, next){
    let name = addSlashes(req.body.name);
    let Query =`INSERT INTO categories ( name) VALUES ('${name}') ` ;

    const promisePool = db_pool.promise();

    let rows = [];
    try{ [rows] = await promisePool.query(Query);}
    catch (err){ console.log(err) }
    next();
}
// =====================================================================================================================


// Update
// =====================================================================================================================
async function UpdateCategory(req, res, next){
    let id = parseInt(req.params.id);
    if(id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let name = addSlashes(req.body.name);
    let Query = `UPDATE categories SET name='${name}' WHERE id='${id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query);}
    catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================


// Read
// =====================================================================================================================
async function GetAllCategories(req,res,next){
    let filter = (req.query.filter !== undefined) ? req.query.filter : "";
    let Query="SELECT * FROM categories";
    let wh="";
    if(filter !== ""){
        wh += (wh === "")?" WHERE " : " AND ";
        wh += ` ( name LIKE '%${filter}%' )`;
    }

    Query += wh;
    Query += " ORDER BY name ASC ";
    Query+= " LIMIT 0,100 ";

    const promisePool = db_pool.promise();
    let rows=[];
    req.category_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.category_data=rows;
    } catch (err) {
        console.log(err);
    }

    next();
}
// =====================================================================================================================


// Get Course Name
// =====================================================================================================================
async function GetCategoryName(req,res,next){
    let Query="SELECT * FROM categories";

    const promisePool = db_pool.promise();
    let rows=[];
    req.category_name=[];
    try {
        [rows] = await promisePool.query(Query);
        for(let row of rows) {
            req.category_name[row.id] = row.name;
        }
    } catch (err) {
        console.log(err);
    }

    next();
}
// =====================================================================================================================


// Get One Course
// =====================================================================================================================
async function GetOneCategory(req,res,next){
    let id = parseInt(req.params.id);
    if(id === NaN ||(id <= 0) ){
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`SELECT * FROM categories WHERE id = '${id}' `;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_category_data=[];
    try {
        [rows] = await promisePool.query(Query);
        if(rows.length > 0){ req.category_data = rows[0]; }
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================


// Delete
// =====================================================================================================================
async function DeleteCategory(req,res,next){
    let id = parseInt(req.body.id);
    if(id > 0) {
        let Query =`DELETE FROM categories  WHERE id = '${id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try{ [rows] = await promisePool.query(Query); }
        catch (err){ console.log(err) }
    }
    next();
}
// =====================================================================================================================

module.exports = { AddCategory,UpdateCategory,GetAllCategories,GetCategoryName,GetOneCategory, DeleteCategory, }