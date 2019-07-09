var express = require('express');
var router = express.Router();
const mysql = require('mysql');
/* GET home page. */
router.get('/', function(req, res, next) {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "heads"
  });
  connection.query("SELECT * FROM landing_page", function (err, result) {
    if(err) return res.redirect('/error');
    res.render('index', {jobs: result});
  });
});

/* job description */
router.get('/job', (req, res) => {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "heads"
  });
  connection.query("SELECT * FROM landing_page", function (err, result) {
    if(err) return res.redirect('/error');
    res.render('job', {job: result});
  })
  
})

/*  apply for job */
router.get('/applyjob', (req, res) => {
  res.render('applyjob');
})

/* error */
router.get('/error', (req, res)=> {
  res.render('error');
})
module.exports = router;
