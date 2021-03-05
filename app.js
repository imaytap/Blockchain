var mysql = require("mysql");

var baglanti = mysql.createConnection({
    host:"localhost",
    user:"root",
    pass:""
});

baglanti.connect(function(err){
    if(err) throw err;

    console.log("Bağlantı Başarıllı")
})