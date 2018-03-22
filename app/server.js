var express = require('express')
var request = require('request')
var app = express()
var host = 'https://stijnhoeks.github.io/performance-matters-server-side'

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/app', function (req, res) {
  request(host, function (error, response, body) {
    var data = JSON.parse(body)
    res.render('index.ejs', {data: data})
  });
})

app.get('/app/:id', function (req, res) {
  request(host + req.params.id, function (error, response, body) {
    var data = JSON.parse(body)
    res.render('detail.ejs', {data: data})
  });
})

var server = app.listen(1337, function () {
   console.log('server is running on port 1337')
})