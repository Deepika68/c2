var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://127.0.0.1:27017/coffee',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))
app.post("/loginDetials", function(req, res) {

    var userName = req.body.userName;
    var passw = req.body.passw;

    if(req.body.userName && req.body.passw) 
    {
        console.log('Checkking userName: ' + userName + ' password: ' + passw);          
      //  var db = new sqlite3.Database('usersDataBase'); 
     var User = db.collection("customer").find({username: req.body.username}, function(err, customers){
        //db.close(); 
        if (!User == (req.body.password))
            {
                console.log('Login Fail')
                res.redirect('log.html')
            }
            else
            {               
                 
                    console.log('Login Successful')
                    res.redirect('home.html')

                

            }
        });
        
    }  
    db.close();

});
app.get("/",(req,res)=>{
    
    return res.redirect('log.html');
}).listen(3050);



console.log("Listening on PORT 1000");