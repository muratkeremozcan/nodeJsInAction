// RESTful API / RESTful web service is an api that uses HTTP requests to GET, POST, PUT, DELETE data https://searchmicroservices.techtarget.com/definition/RESTful-API
const express = require('express'); // Express (framework) focuses on modeling your application in terms of HTTP requests and responses.
const app = express(); // create an application instance
const articles = [{
  title: 'Example'
}]; // an array of articles
const bodyParser = require('body-parser'); // implementing POST requests requires body parsing. Body parser knows how to accept MIME-encoded POST request bodies and turn them into JSON // MIME : Multipurpose Internet Mail Extensions
const Article = require('./db').Article; // loads the database module from db.js, gets the Article class


// app.get/set/post/put/delete/use(routeName, routeHandler)
app.set('port', process.env.PORT || 3000); // bind the application to a TCP port

// Listing 3.2 BODY PARSING SUPPORT
app.use(bodyParser.json()); // request MIME-encoded POST request bodies as JSON: JSON body parsing
app.use(bodyParser.urlencoded({
  extended: true
})); // form-encoded bodies

app.get('/', (req, res) => { // adding a root route handler
  res.send('Hello World');
});

app.get('/articles', (req, res, next) => { // get all articles
  Article.all((err, articles) => { // all method of Article class with callback, , utilizing sqlite3.all
    if (err) return next(err);
    res.send(articles); // respond with the array of articles. Express automatically converts the array to JSON
  });
});

app.post('/articles', (req, res, next) => { // create an article
  res.send('OK');
});

app.get('/articles/:id', (req, res, next) => { // get a single article
  const id = req.params.id; // request parameter binds with the route and gets assigned to a constant
  Article.find(id, (err, article) => { // find method of Article, utilizing sqlite3.get
    if (err) return next(err);
    res.send(article); // respond with the single article
  });
});

app.delete('/articles/:id', (req, res, next) => { // deletes an article
  const id = req.params.id; // request parameter binds with the route and gets assigned to a constan
  Article.delete(id, (err) => { // delete method of article, utilizing sqlite3.run with DELETE sql query
    if (err) return next(err);
    res.send({ message: 'Deleted' });
  });
});

app.listen(app.get('port'), () => {
  console.log('App started on port ', app.get('port'));
});

module.exports = app;

// test with curl :  curl http//localhost:3000/articles  , articles/0
// https://curl.haxx.se/
// to post : curl --data "title=Example 2" http://localhost:3000/articles