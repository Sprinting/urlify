// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const urls = require('./server/url.js')



// http://expressjs.com/en/starter/static-files.html
app.set('view engine','pug')
app.use('/public',express.static('public'));

app.get('/',function(req,res){
        res.render('index',{"app_title":"API Basejump | URL Shortner Microservice ",
                           "examples":[
                             req.headers.host+'/make/https://www.google.com',                        
                             req.headers.host+'/fcc'
                           ]})
})
app.use('/',urls.router);



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  // console.log('Your app is listening on port ' + listener.address().port);
});
