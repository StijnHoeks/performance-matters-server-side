var express = require('express')
var request = require('request')
var app = express()
var host = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=dbuOrGB7xoks2WobqPacpFP6fODFIU7gR0rStswa';
/*var host = 'http://dennistel.nl/movies/'*/

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function (req, res) {
  request(host, function (error, response, body) {
    var data = JSON.parse(body)
    res.render('index', {data: data})
  });
})

app.get('/:id', function (req, res) {
  request(host/* + req.params.photos*/, function (error, response, body) {
    var data = JSON.parse(body);
    var photos = req.params;
    console.log(data);
    res.render('detail', {
    	data: data,
      photos: photos
    })
  });
})

var server = app.listen(1337, function () {
   console.log('server is running on port 1337')
})
