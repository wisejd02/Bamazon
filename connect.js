var mysql = require("mysql");

var ConnectionInfo = function (db){
    this.db = db; 
}
ConnectionInfo.prototype.connect = function (){
    var conn = mysql.createConnection({
        host: "localhost",
        port: 8889,
      
        // Your username
        user: "root",
      
        // Your password
        password: "root",
        database: this.db
      });
      return conn;
}

module.exports = ConnectionInfo;