// var md5 = require('md5');

// is Logged Function
// =====================================================================================================================
// async function isLogged(req, res, next){
//     const jwtToken = req.cookies.ImLoggedToYoman;
//     let user_id=-1;
//     if (jwtToken !== "") {
//         jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
//             console.log("decodedToken=",decodedToken);
//             if (err) { console.log("err=",err); }
//             else {
//                 let data = decodedToken.data;
//                 console.log("data=",data);
//                 user_id = data.split(",")[0];
//                 req.user_id = user_id
//             }
//         })
//     }
//     if(user_id < 0) res.redirect("/login");
//     next();
// }
// =====================================================================================================================


// Check Login Function
// =====================================================================================================================
// async function CheckLogin(req, res, next){
//     let userName = (req.body.userName !== undefined) ? addSlashes(req.body.userName) : "";
//     let password = (req.body.password !== undefined) ? req.body.password : "";
//     let enc_pass = md5("A"+password);
//     let Query = `SELECT * FROM users WHERE userName = '${userName}' AND password = '${enc_pass}'`;
//
//     const promisePool = db_pool.promise();
//     let rows=[];
//     try { [rows] = await promisePool.query(Query); }
//     catch (err) { console.log(err); }
//
//     if(rows.length > 0){
//         req.validUser = true;
//         let val = `${rows[0].id},${rows[0].name}`;
//         var token = jwt.sign (
//             { data: val },
//             'myPrivateKey',
//             { expiresIn: 31*24*60*60 }); // in sec
//         res.cookie("ImLoggedToYoman", token, { maxAge: 31*24*60*60 * 1000, }); } // 3hrs in ms
//     console.log("Generated token:", token);
//     console.log("Cookies in response:", res.getHeader("Set-Cookie"));
//     next();
// }
// =====================================================================================================================


// Create
// =====================================================================================================================
async function AddUser(req, res, next){
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";
    let username = (req.body.username !== undefined)  ?addSlashes(req.body.username): "";
    let password = (req.body.password !== undefined) ? req.body.password: "";
    // let enc_pass = md5("A"+password);
    let email = (req.body.email !== undefined) ? addSlashes(req.body.email): "";
    let typeid = (req.body.typeid !== undefined) ? Number(req.body.typeid): -1;

    // let Query="INSERT INTO users";
    // Query +="(`name`,`userName`,`password`,`email`,`typeID`,`StudentID`)";
    // Query +="VALUES";
    // Query +=`('${name}','${userName}','${enc_pass}','${email}','${typeID}')`;

    let Query="INSERT INTO users";
    Query +="(`name`,`username`,`password`,`email`,`typeid`)";
    Query +="VALUES";
    Query +=`('${name}','${username}','${password}','${email}','${typeid}')`;

    const promisePool = db_pool.promise();
    let rows = [];
    try{ [rows] = await promisePool.query(Query); }
    catch (err){ console.log(err) }
    next();
}
// =====================================================================================================================


// Update
// =====================================================================================================================
async function UpdateUser(req, res, next){
    let id = parseInt(req.params.id);
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name): "";
    let username = (req.body.username !== undefined)  ?addSlashes(req.body.username): "";
    let email = (req.body.email !== undefined) ? addSlashes(req.body.email): "";
    let typeid = (req.body.typeid !== undefined) ? parseInt(req.body.typeid): -1;

    if(id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let Query =`UPDATE users SET `;
    Query +=`name   ='${name}' ,`;
    Query +=`userName  ='${username}' ,`;
    Query +=`email  ='${email}' ,`;
    Query +=`typeid='${typeid}' ,`;
    Query +=` WHERE id='${id}'`;

    const promisePool = db_pool.promise();
    let rows=[];
    try { [rows] = await promisePool.query(Query); }
    catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================


// Read - All Users
// =====================================================================================================================
async function GetAllUsers(req,res,next){
    let page = 0;
    let rowPerPage = 2
    if(req.query.p !== undefined) { page = parseInt(req.query.p); } //
    req.page = page; // מחזיר לצד הקדימי את העמוד הנוכחי

    // page counter
    let rows = [];
    let Query = "SELECT COUNT(id) as cnt FROM users";
    const promisePool = db_pool.promise();
    let total_rows = 0;
    try {
        [rows] = await promisePool.query(Query);
        total_rows =rows[0].cnt;
    } catch (err){ console.log(err); }
    req.total_pages= Math.floor(total_rows / rowPerPage);

    // get current page
    Query = "SELECT * FROM users";
    Query += ` LIMIT ${page * rowPerPage},${rowPerPage} `;
    req.users_data = [];
    try {
        [rows] = await promisePool.query(Query);
        req.users_data = rows;
    } catch (err) { console.log(err);}
    next();
}
// =====================================================================================================================


// Read - One User
// =====================================================================================================================
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
// =====================================================================================================================


// Delete
// =====================================================================================================================
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
// =====================================================================================================================

// module.exports = { AddUser,GetOneUser,GetAllUsers,UpdateUser,DeleteUser, CheckLogin, isLogged }
module.exports = { AddUser,GetOneUser,GetAllUsers,UpdateUser,DeleteUser }