var express = require('express');
var app     = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var mysql  = require('mysql');

var dbHost = process.env.MYSQL_HOST,
      dbUser = process.env.MYSQL_USER,
      dbDatabase = process.env.MYSQL_DATABASE,
      dbPassword = process.env.MYSQL_PASSWORD;


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

app.get('/version', function(req, res) {
	var result = [
	  { version : "33"}
	];
  res.json(result);
});


//get either featured products or products with keyword
app.get('/products', function(req, httpRes) {

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


	if(req.query.featured == null && req.query.keyword == null) {
		httpRes.statusCode = 400;
		return httpRes.send('All products cannot be returned, need to provide a search condition');
	}


	if (req.query.featured != null) {
		dbconn.query('SELECT * FROM PRODUCT where FEATURED = ?', req.query.featured, function(err, records){
		  if(err) throw err;
		  httpRes.json(records);
		});
	} else if (req.query.keyword != null){
		dbconn.query('SELECT * FROM PRODUCT where SKU in (select SKU from PRODUCT_KEYWORD where KEYWORD = ?)', req.query.keyword, function(err, records){
		  if(err) throw err;
		  httpRes.json(records);
		});
	} 

	dbconn.end(function(err) {
	    console.log('Database connection is end');
	});

});


//get based on sku #
app.get('/products/:sku', function(req, httpRes) {

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

	dbconn.query('SELECT * FROM PRODUCT where SKU = ?', req.params.sku, function(err, records){
	  if(err) throw err;
	  httpRes.json(records);
	});

	dbconn.end(function(err) {
	    console.log('Database connection is end');
	});

});


//add product through post 
app.post('/products', function(req, httpRes) {
	if(!req.body.hasOwnProperty('DESCRIPTION') || !req.body.hasOwnProperty('NAME')) {
		httpRes.statusCode = 400;
		return httpRes.send('Error 400: need to have valid DESCRIPTION and NAME.');
	}

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

	var record= { DESCRIPTION: req.body.DESCRIPTION, HEIGHT: req.body.HEIGHT, LENGTH: req.body.LENGTH,  NAME: req.body.NAME, WEIGHT: req.body.WEIGHT, WIDTH: req.body.WIDTH, FEATURED: req.body.FEATURED, AVAILABILITY: req.body.AVAILABILITY, IMAGE: req.body.IMAGE, PRICE: req.body.PRICE};


	dbconn.query('INSERT INTO PRODUCT SET ?', record, function(err,dbRes){
		if(err) throw err;
		console.log('Last record insert SKU:', dbRes.insertId);

		result = [
		  { status : "SUCCESS",
		  SKU : dbRes.insertId}
		];

		httpRes.json(result);


	});

	dbconn.end(function(err) {
	    console.log('Database connection is end');
	});

});




app.listen(process.env.PORT || 8080);
