var express = require('express');
var app     = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var mysql  = require('mysql');

var dbHost = process.env.MYSQL_HOST,
      dbUser = process.env.MYSQL_USER,
      dbDatabase = process.env.MYSQL_DATABASE,
      dbPassword = process.env.MYSQL_PASSWORD;




//	dbHost = 'localhost';
//	dbUser = 'product';
//	dbDatabase = 'product';
//	dbPassword = 'password';

console.log('!!!!!!!!!!!!!!!!!!!!!!dbHost ' + dbHost);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbUser ' + dbUser);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbDatabase ' + dbDatabase);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbPassword ' + dbPassword);

app.get('/', function(req, res) {
	var result = [
	  { status : "strange"}
	];
  res.json(result);
});

app.get('/hello', function(req, res) {
	var result = [
	  { status : "hello 2"}
	];
  res.json(result);
});







app.post('/process', function(req, res) {
  if(!req.body.hasOwnProperty('creditCardNumber') || !req.body.hasOwnProperty('verificationCode')) {
    res.statusCode = 400;
    return res.send('Error 400: need to have valid creditCardNumber and verificationCode.');
  }


	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var randomInt = (Math.random() * 9000000 + 1000000) | 0;

	var result = null;



	var dbconn = mysql.createConnection({
	  host     : dbHost,
	  user     : dbUser,
	  password : dbPassword,
	  database : dbDatabase
	});

	dbconn.connect(function(err){
	  if(err){
	    console.log('Database connection error');
	  }else{
	    console.log('Database connection successful');
	  }
	});

	dbconn.query('SELECT * FROM PRODUCT',function(err, records){
	  if(err) throw err;

//	  console.log(records);
	  console.log(records[0].NAME);

	result = [
	  { status : "SUCCESS",
	  name : records[0].NAME,
	  orderNumber : req.body.orderNumber,
	  transactionDate : date,
	  transactionNumber : randomInt}
	];

	  res.json(result);

	});



});


app.listen(process.env.PORT || 8080);
