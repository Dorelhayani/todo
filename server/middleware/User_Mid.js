let md5 = require('md5');
async function isLogged(req, res, next){
    const jwtToken = req.cookies.ImLogged;
    if (!jwtToken) return res.redirect("/auth/login");

    jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
        if (err) {
            console.log("JWT error:", err);
            return res.redirect("/auth/login");
        }
        let data = decodedToken.data;
        let parts = data.split(",");
        req.user_id = parts[0];
        req.name = parts[1];
        next();
    });
}
async function CheckLogin(req, res, next){
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name) : "";
    let password = (req.body.password !== undefined) ? req.body.password : "";
    console.log(req.body)
    let enc_pass = md5("A"+password);
    let Query = `SELECT * FROM users WHERE name = '${name}' AND password = '${enc_pass}'`;

    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query); }
    catch (err) { console.log(err); }

    if(rows.length > 0){
        req.validUser = true;
        let val = `${rows[0].id},${rows[0].name}`;
        const token = jwt.sign (
            { data: val },
            'myPrivateKey',
            { expiresIn: 31*24*60*60 }); // in sec
        res.cookie("ImLogged", token, { maxAge: 31*24*60*60 * 1000, }); // 3hrs in ms
    }
    next();
}
async function AddUser(req, res, next){
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";
    let password = (req.body.password !== undefined) ? req.body.password: "";
    let enc_pass = md5("A"+password);

    let Query="INSERT INTO users";
    Query +="(`name`,`password`)";
    Query +="VALUES";
    Query +=`('${name}','${enc_pass}')`;

    const promisePool = db_pool.promise();
    let rows = [];
    try{ [rows] = await promisePool.query(Query); }
    catch (err){ console.log(err) }
    next();
}
async function UpdateUser(req, res, next){
    let id = parseInt(req.params.id);
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";

    if(id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`UPDATE users SET `;
    Query +=`name   ='${name}' ,`;
    Query +=` WHERE id='${id}'`;

    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query); }
    catch (err) { console.log(err);}
    next();
}
async function GetAllUsers(req,res,next){
    let page = 0;
    let rowPerPage = 2
    if(req.query.p !== undefined) { page = parseInt(req.query.p); } //
    req.page = page;

    let rows = [];
    let Query = "SELECT COUNT(id) as cnt FROM users";
    const promisePool = db_pool.promise();
    let total_rows = 0;
    try {
        [rows] = await promisePool.query(Query);
        total_rows =rows[0].cnt;
    } catch (err){ console.log(err); }
    req.total_pages= Math.floor(total_rows / rowPerPage);

    Query = "SELECT * FROM users";
    Query += ` LIMIT ${page * rowPerPage},${rowPerPage} `;
    req.users_data = [];
    try {
        [rows] = await promisePool.query(Query);
        req.users_data = rows;
    } catch (err) { console.log(err);}
    next();
}
async function GetOneUser(req,res,next){
    let id = parseInt(req.params.id);
    if(id === NaN ||(id <= 0) ){
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`SELECT * FROM users  WHERE id = '${id}' `;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_user_data=[];
    try {
        [rows] = await promisePool.query(Query);
        if(rows.length > 0){ req.courses_data = rows[0]; }
    } catch (err) { console.log(err);}
    next();
}
async function DeleteUser(req,res,next){
    let id = parseInt(req.body.id);
    if(id > 0) {
        let Query =`DELETE FROM users  WHERE id = '${id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try{ [rows] = await promisePool.query(Query); }
        catch (err){ console.log(err) }
    }
    next();
}
module.exports = { AddUser,GetOneUser,GetAllUsers,UpdateUser,DeleteUser, CheckLogin, isLogged}