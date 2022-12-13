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

app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var email=req.body.email;
    var password = req.body.password;
    var address=req.body.address;
    var phno = req.body.phno;
    var data = {
        "username": name,
        "email":email,
        "password": password,
        "cus_address" : address,
        "cus_ph" : phno
    }

    db.collection('customer').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('home.html')

})


app.get("/",(req,res)=>{
    
    return res.redirect('sign.html');
}).listen(3020);


console.log("Listening on PORT 4000");