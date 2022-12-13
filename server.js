var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const ejs=require('ejs');
const app = express()
var fs = require('fs');
var path = require('path');
require('dotenv/config');

app.set('view engine','ejs');
app.set('views',"./views");
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://127.0.0.1:27017/coffee',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: false }))

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))
 

app.get("/", function (req, res) {
    res.redirect("log.html");
});
const customersSchema={
    username:String,
    email:String,
    password:String,
    cus_address:String,
    cus_ph:String
    
}
const Customer= mongoose.model('Customer',customersSchema);

var email;
 var password;
app.post("/loginDetails", function(req, res) {
    email=req.body.userName;
     password=req.body.passw;
     checkpass(req,res,email,password)
})

app.get('/log',checkpass);
function checkpass(req,res,email,password){
    mongoose.model('Customer').findOne({email:email,password:password},function(err,customers){
        console.log(customers);
		if(customers!= null){
            console.log("Done Login");

                res.redirect('home.html')
				
			}      
        else{
			console.log("failed");
            res.redirect('log.html')
		}
	});
};
app.get("/sign_up",function(req,res){
    res.redirect("sign.html");
})
var email;
app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
     email = req.body.email;
    var password = req.body.password;
    var address =req.body.address;
    var contact = req.body.phno;
    
   
    var data = {
        "username": name,
        "email" : email,
        "password": password,
        "cus_address" : address,
        "cus_ph" : contact
        
    }

    db.collection('customers').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('home.html')

})

app.get('/',(req,res)=>{
    res.render('home.html');
})
app.get("/profile",(req,res)=>{
    Customer.find({email:email},function(err,customers){
        
       res.render('profile',{
        customersList:customers,
       
       })

    })
})
app.get("/update1",function(req,res){
    res.redirect("update_prof.html");
})

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/update_prof',(req,res)=>{
    Customer.find({email:email},function(err,customers){
        console.log(email);
       res.render('update_prof',{
        customersList:customers,
       
       })

    })
})

    app.get('/',(req,res)=>{
        res.render('home');
    })
    
    app.get('/update_prof',(req,res)=>{
        Customer.find({username:email},function(err,customers){
            console.log(email);
           res.render('update_prof',{
            customersList:customers,
           
           })
    
        })
    })
    app.post("/update_pro",(req,res)=>{

        
        var newpass = req.body.new_pass;
        var password=req.body.confirm_pass;
        var address = req.body.address;
        var number = req.body.number;
        if(newpass == password){
        db.collection('customers').updateOne({email:email},{$set:{password:password,cus_address:address,cus_ph:number}},(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Record updated Successfully");
        });
    
         res.redirect('profile')
    }
    })
    var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });
var imgModel = require('./model');
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/raw', (req, res) => {
  imgModel.find({id:/^CR/}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('raw', { items: items });
      }
  });
});

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
var imgModel = require('./model');
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/food', (req, res) => {
  imgModel.find({id:/^FC/}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('food', { items: items });
      }
  });
});

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
var imgModel = require('./model');
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/cont', (req, res) => {
  imgModel.find({id:/^MC/}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('cont', { items: items });
      }
  });
});

var amount;
var total;
app.post('/addcart',(req,res)=>{
       var id=req.body.id;
      var qty=req.body.qty;
       amt=req.body.price;
      amount=amt*qty;
      var name=req.body.name;
   //   total=amount+total;
      var data={
        "item_id":id,
        "email":email,
        "quantity":qty,
        "total_price":amount,
        "item_name":name
      }
      db.collection('orders').insertOne(data,(err,collection)=>{
        if(err)
          console.log(err)
        
      })
})


app.get('/',(req,res)=>{
    res.render('home.html');
})
app.post('/message',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var number=req.body.number;
    var subject=req.body.subject;
    var mess=req.body.mess;
    var data={
        "name":name,
        "email":email,
        "number":number,
        "subject":subject,
        "message":mess
    }
    db.collection('contacts').insertOne(data,(err,collection)=>{
        if(err){
            console.log(err);
        }
        return res.redirect('home.html');
    })
})

var ordersSchema= new mongoose.Schema({
    item_id:String,
    email:String,
    quantity:String,
    item_name:String,
    total_price:Number

   

})
const Order= mongoose.model('Order',ordersSchema);
//view cart
var pid;

app.get('/cart',(req,res)=>{
    db.collection('orders').find({email:email}).toArray(function(err,orders){
        //console.log(orders.item_id)
     if(err){
         console.log(err);
         res.status(500).send('An error occurred', err);
     }
        else
        {
            var subtotal=[];
            var oid=[];
            console.log(orders.length)

            for(i=0;i<orders.length;i++){
                pid=orders[i].item_id;
                oid.push(pid);
               subtotal.push(orders[i].total_price);
               
            }
           var total=0;
           console.log(subtotal)
            for(i=0;i<subtotal.length;i++){
                total=total+subtotal[i]
            }
            console.log(oid)
            console.log(total)
            console.log('hellohi')
            imgModel.find({id:oid}, (err, items) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                  console.log('storing')
                    res.render('cart', {total:total,items:items});
                 //   oid.splice(0,orders.length);
                }
               })

          console.log('hello')
         }
           })
           
 })
   //delete the product from cart
var did;
app.post("/cartbtn",(req,res)=>{
    did=req.body.sid;
    console.log('delete1');
   deletecart(req,res,did)
    
})
app.get('/cart',deletecart);
function deletecart(req,res,did){
mongoose.model('Order').deleteOne({email:email,item_id:did},(err,orders)=>{
    if(err)
    console.log(err)
  else{
    cartdisplay(req,res)
  }
})
}
app.get('/cart',cartdisplay) 
function cartdisplay(req,res){
    db.collection('orders').find({email:email}).toArray(function(err,orders){
        //console.log(orders.item_id)
     if(err){
         console.log(err);
         res.status(500).send('An error occurred', err);
     }
        else
        {
            var subtotal=[]
            var oid=[];
            console.log(orders.length)

            for(i=0;i<orders.length;i++){
                pid=orders[i].item_id;
                oid.push(pid);    
                subtotal.push(orders[i].total_price)          
            }
            var total=0;
          // console.log(subtotal)
            for(i=0;i<subtotal.length;i++){
                total=total+subtotal[i]
            }
            console.log(oid)
            imgModel.find({id:oid}, (err, items) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                  console.log('storing')
                    res.render('cart', {total:total, items: items});
                 //   oid.splice(0,orders.length);
                }
               })

          console.log('deleteone')
         }
           })
    }

//delete all product from cart
app.post("/deleteall",(req,res)=>{
    console.log('coming');
   deletecartall(req,res)
    
})

app.get('/cart',deletecartall);
function deletecartall(req,res){
    console.log('deletemany')
mongoose.model('Order').deleteMany({email:email},(err,orders)=>{
    if(err)
    console.log(err)
  else{
            res.render('home.html');
  }
        
});
}


app.get('/',(req,res)=>{
    res.render('home.html');
})



app.post("/charge", (req, res) => {
    try {
        stripe.customers
          .create({          
            email: req.body.email,
            source: req.body.stripeToken
          })
          .then(customer =>
            stripe.charges.create({
              amount: req.body.amount * 100,
              currency: "usd",
              customer: customer.id
            })
          )
          
 
          .then(() => res.render("success.html"))        
          .catch(err => console.log(err));
      } catch (err) {
        res.send(err);
      }
    });
//logout
    app.get('/logout',(req,res)=>{
        req.session.destroy(function(err){
            if(err){
                console.log(err);
                res.send("error")
            }else{
                res.render('log.html',{title:"Express",logout:"logout successfully"})
            }
        })
    });
var port = process.env.PORT || 8888;
app.listen(port, function () {
    console.log("Server Has Started!");
});

