var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
  
var fs = require('fs');
var path = require('path');
require('dotenv/config');
mongoose.connect("mongodb://127.0.0.1:27017/coffee",
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected')
  });
  app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
// Set EJS as templating engine 
app.set("view engine", "ejs");
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
app.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});
app.post('/', upload.single('image'), (req, res, next) => {
  
  var obj = {
      id: req.body.id,
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/jpg'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/');
      }
  });
});
//res.render('display', { items: items });
var port = process.env.PORT || '2022'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})