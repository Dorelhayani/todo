// Installed Libraries
// express, body-parser, mysql2, slashes@2.0.0 ,cookie-parser, jsonwebtoken

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

// const users_MID = require("./server/middleware/Users_mid");
//
// const Activity_rtr = require('./server/Routs/Activity_R')
// app.use('/activity', [users_MID.isLogged], Activity_rtr);
//
// const corse_rtr = require('./server/Routs/Course_R');
// app.use('/course', [users_MID.isLogged],corse_rtr);
//
// const users_rtr = require('./server/Routs/Users_R');
// app.use('/users', [users_MID.isLogged], users_rtr);
//
// const auth_R = require('./server/Routs/auth_R');
// app.use('/', auth_R);
app.get('/', (req, res)=>{ res.render("index",{}); });
app.listen(port, ()=> { console.log(`Now Listening On Port http://localhost:${port}`); });