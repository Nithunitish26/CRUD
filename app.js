const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");

require("dotenv").config();

//application and portsetup

const app = express();
const port = process.env.PORT || 5000;

//middleware setup

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static Files
app.use(express.static("public"));

// Template Engine
const handlebars = exphbs.create({ extname: ".hbs" });
app.engine('hbs', handlebars.engine); // Use 'hbs' consistently
app.set("view engine", "hbs");

// //mysql
// const con=mysql.createPool({
//   connectionLimit:10,
//   host    : process.env.DB_HOST,
//   user    : process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });

// //check database connection 
// con.getConnection((err,connection)=>{
//   if(err) throw err
//   console.log("connection susses")
// })

// // Router
// app.get('/', (req, res) => {
//   res.render("home"); // Renders views/home.hbs
// });

const routes=require("./server/routes/students");
app.use('',routes);

// Listen on the specified port
app.listen(port, ()=> {
console.log("Listening port: "+port);
});
