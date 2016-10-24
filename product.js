var mysql  = require('mysql');
var dbconn = mysql.createConnection({
  host     : 'localhost',
  user     : 'myusr',
  password : '123456',
  database : 'mydb'
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
