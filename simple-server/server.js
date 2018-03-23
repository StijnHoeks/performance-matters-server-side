var express = require('express')
var request = require('request')
var session = require('express-session')
var app = express()
var host = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=dbuOrGB7xoks2WobqPacpFP6fODFIU7gR0rStswa';
/*var host = 'http://dennistel.nl/movies/'*/

var sess = {
  secret: "gdhgfdgdshsdf",
  cookie: {},
  resave: true,
  saveUninitialized: true
};

app.use(session(sess));

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function (req, res) {
  request(host, function (error, response, body) {
    var data = JSON.parse(body)
    res.render('index', {data: data})
    /*req.session.data = data;
    console.log("???");*/
  });
})

app.get('/:id', function (req, res) {
  request(host /*+ req.params.photos*/, function (error, response, body) {
    var data = req.session.data;
    var photos = req.params;
    var id = req.params.id;
    console.log(req.session.data);
    res.render('detail', {
    	data: data,
      photos: photos
    })
  });
})

var server = app.listen(1337, function () {
   console.log('server is running on port 1337')
})
