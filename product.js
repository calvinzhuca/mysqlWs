var mysql  = require('mysql');

var dbHost = process.env.MYSQL_HOST,
      dbUser = process.env.MYSQL_USER,
      dbDatabase = process.env.MYSQL_DATABASE,
      dbPassword = process.env.MYSQL_PASSWORD;

console.log('!!!!!!!!!!!!!!!!!!!!!!dbHost ' + dbHost);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbUser ' + dbUser);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbDatabase ' + dbDatabase);
console.log('!!!!!!!!!!!!!!!!!!!!!!dbPassword ' + dbPassword);

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


var record= { firstname: 'Rahul', lastname: 'Kumar', email: 'abc@domain.com' };

dbconn.query('INSERT INTO users SET ?', record, function(err,res){
  if(err) throw err;

  console.log('Last record insert id:', res.insertId);
});

dbconn.end(function(err) {
  // Function to close database connection
});
