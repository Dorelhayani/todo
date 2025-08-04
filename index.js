// Installed Libraries
// express, body-parser, ejs, mysql2, slashes@2.0.0 ,cookie-parser, jsonwebtoken, md5

const port = 1234;
const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
global.jwt = require('jsonwebtoken');

let db_M = require('./server/models/database');
global.db_pool = db_M.pool;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "./views"));

global.addSlashes = require('slashes').addSlashes;
global.stripSlashes = require('slashes').stripSlashes;

global.was_logged = false;

const users_MID = require("./server/middleware/User_Mid");
const users_rtr = require('./server/routs/User_R');
app.use('/users', [users_MID.isLogged], users_rtr);
// app.use('/users', users_rtr);


const category_rtr = require('./server/Routs/Category_R');
app.use('/category', [users_MID.isLogged],category_rtr);
// app.use('/category', category_rtr);

const task_rtr = require('./server/Routs/Tasks_R')
app.use('/task', [users_MID.isLogged], task_rtr);
// app.use('/task', task_rtr);

const auth_R = require('./server/Routs/Auth_R');
app.use('/auth', auth_R);

app.get('/', (req, res)=>{ res.render("login_page",{}); });
app.listen(port, ()=> { console.log(`Now Listening On Port http://localhost:${port}`); });