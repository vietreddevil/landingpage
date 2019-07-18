var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require("body-parser");
var session = require('express-session');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const db = "heads";
const host = "localhost";
const user = "root";
const pwd = "";

router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
/* GET home page. */
router.get('/adminLogin', (req, res)=> {
  res.clearCookie("job_id");
  if (req.session.loggedin) { 
    var connection = mysql.createConnection({
      host: host,
      user: user,
      password: "",
      database: db
    });
    connection.connect((err) => {
      if (err) console.log(err)
      connection.query("SELECT * FROM landing_page", function (error, result) {
        if(error) return res.redirect('/error');
        res.render('admin', {jobs: result});
      });
    });
  }else {
    res.render('login');
  }
});
router.post('/checklogin', urlencodedParser, (req, res)=> {
  var username = req.body.username;
  var pwd = req.body.password;
  if(username == "admin@orm.vn" && pwd == "hihihaha") {
    req.session.loggedin = true;
  }
  return res.redirect('/adminLogin');
})
router.get('/', function(req, res) {
  res.clearCookie("job_id");
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("SELECT * FROM landing_page", function (error, result) {
      if(error) return res.redirect('/error');
      connection.query("SELECT * FROM landing_page_department_name", function (err, rs) {
        console.log(rs);
        res.render('index', {jobs: result, teams:rs});
      });
    });
  });
});
router.get('/checkjob/:id', urlencodedParser, (req, res) => {
  res.cookie("job_id", req.params.id, {
    expires: new Date(Date.now() + 253402300000000),
    httpOnly: true
  });
  return res.redirect('/job');
});
router.get('/editjob/:id', urlencodedParser, (req, res) => {
  res.cookie("job_id", req.params.id, {
    expires: new Date(Date.now() + 253402300000000),
    httpOnly: true
  });
  return res.redirect('/edit');
});
/* admin edit */
router.get('/edit', (req, res)=> {
  if (req.session.loggedin) { 
    var connection = mysql.createConnection({
      host: host,
      user: user,
      password: "",
      database: db
    });
    connection.connect((err) => {
      if (err) console.log(err)
      connection.query("SELECT * FROM landing_page WHERE id = '" + req.cookies["job_id"] + "'", function (error, result) {
        if(error) return res.redirect('/error');
        console.log(result[0]);
        res.render('job', {job: result[0], type:'admin'});
      });
    });
  }else {
    res.redirect('/');
  }
});
router.post('/saveedit', urlencodedParser,(req, res)=> {
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  console.log(req.body.jd);
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("select name from landing_page_department_name where name = '" + req.body.team + "'", function (error, result) {
      if(error) return res.redirect('/error');
      if(result.length > 0) {
        
      }else {
        connection.query("INSERT INTO landing_page_department_name (name) VALUES ('" + req.body.team + "')", function (err, resultt) {
          if(err) return res.redirect('/error');
        });
      }
    });
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("update landing_page set city = '" + req.body.city + "', team = '" + req.body.team + "',name = '" + req.body.name + "',work_type = '" + req.body.work_type + "',description = '" + req.body.jd + "'  WHERE id = '" + req.cookies["job_id"] + "'", function(err, result) {
      if(err) return res.redirect('/error');
      return res.redirect('/edit');
    });
  });
});
router.get('/deleteJob/:id/:team', urlencodedParser, (req, res)=> {
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("Delete from landing_page WHERE id = '" + req.params.id + "'", function(err, result) {
      if(err) return res.redirect('/error');
      connection.query("select * from landing_page WHERE team = '" + req.params.team + "'", function(error, results) {
        if(results.length == 0) {
          connection.query("Delete from landing_page_department_name WHERE name = '" + req.params.team + "'", function(error2, results2) {
            return res.redirect('/adminLogin');
          });
        }else {
          return res.redirect('/adminLogin')
        }
      });
    });
  });
})
/* job description */
router.get('/job', (req, res) => {
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("SELECT * FROM landing_page WHERE id = '" + req.cookies["job_id"] + "'", function (error, result) {
      if(error) return res.redirect('/');
      console.log(result[0]);
      res.render('job', {job: result[0], type:'client'});
    });
  });
})

/*  apply for job */
router.get('/applyjob', urlencodedParser, (req, res) => {
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("SELECT * FROM landing_page WHERE id = '" + req.cookies["job_id"] + "'", function (error, result) {
      if(error) return res.redirect('/');
      res.render('applyjob', {job: result[0], type:'client'});
    });
  });
});

router.post('/apply/:email/:time', (req, res) => {
  var formidable = require('formidable');
  var form = new formidable.IncomingForm();
  var fs = require('fs');
  /* */
  var temp_dirname = __dirname.substr(0, __dirname.lastIndexOf('\\'));
  temp_dirname = temp_dirname.substr(0, temp_dirname.lastIndexOf('\\'));
  
  console.log(temp_dirname);
  ////
  var dir = '../uploads/' + req.params.email + '_' + req.params.time;
  var checkdir = (temp_dirname + '/uploads/' +  req.params.email + '_' + req.params.time).replace(/\\/g, "\/");
  try {
    if (!fs.existsSync(checkdir)){
      fs.mkdirSync(checkdir)
    }
  } catch (err) {
    console.error(err)
  }
  form.uploadDir = dir;//duong dan luu file
  form.keepExtensions = true; //lay ca duoi file
  form.maxFieldsSize = 10 * 1024 * 1024; //10MB
  form.multiples = false;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
    } else {
      var nodemailer = require('nodemailer');
      var handlebars = require('handlebars');
      var fs = require('fs');
      var file_content = fs.readFileSync('./public/mail_template/candidate.html', 'utf8');
      var template = handlebars.compile(file_content);
      var replacements = {
        department_name: fields.jobname,
        name : fields.fullname,
        mail :fields.email,
        phone :fields.phone,
        school :fields.school,
        facebook :fields.facebook,
        github :fields.github,
        linkedin :fields.linkedin,
        portfolio :fields.portfolio,
        web :fields.otherweb,
        info:fields.add_info
      }
      console.log(files.cv.path)
      var mail_content = template(replacements);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'vitcon241097@gmail.com',
          pass: 'viets2a6'
        }
      });
      var mailOptions = {
        from: 'vitcon241097@gmail.com',
        to: 'hr@yay.vn',
        subject: 'CV',
        html: mail_content,
        attachments :[
          {
            path:files.cv.path
          }
        ]
      }
      console.log(mail_content);
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.send("<h1 style='color:RED'>Error</h1>" + error + '<br>');
          console.log(error);
        } else {
          res.send("<h1 style='color:green'>Email sent:</h1>" + info.response + '<br>');
          console.log(info.response);
        }
      });
    }
  });
});


router.get('/cc/:id', (req, res)=> {
  res.send(req.params.id);
})

/* add job */
router.post('/addjob', urlencodedParser, (req, res)=> {
  var name = req.body.name;
  var city = req.body.city;
  var team = req.body.team;
  var work_type = req.body.work_type;
  var description = req.body.description;
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: "",
    database: db
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("select name from landing_page_department_name where name = '" + team + "'", function (error, result) {
      if(error) return res.redirect('/error');
      if(result.length > 0) {
        
      }else {
        connection.query("INSERT INTO landing_page_department_name (name) VALUES ('" + team + "')", function (err, resultt) {
          if(err) return res.redirect('/error');
        });
      }
    });
  });
  connection.connect((err) => {
    if (err) console.log(err)
    connection.query("INSERT INTO landing_page (city, team, work_type, name, description) VALUES ('" + city + "', '" + team + "', '" + work_type + "', '" + name + "', '" + description + "')", function (error, result) {
      if(error) return res.redirect('/error');
      return res.redirect('/adminLogin')
    });
  });
});

router.post('/sendapply', urlencodedParser, (req, res)=> {

});
/* error */
router.get('/error', (req, res)=> {
  res.render('error');
})
module.exports = router;
