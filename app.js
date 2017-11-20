// BASIC EXPRESS BLOG
// author: Julian Hasse
// [2017/11/19]

/* Install: clone to your computer and run "npm install". Then type "node app".
Go to your browser and try the following commands:
localhost:3000/                 => home page
localhost:3000/test             => static test
localhost:3000/api              => json object
localhost:3000/static           => static html page
localhost:3000/article/{id number}    => dynamic content based on the id number from 1-6 you pass
*/

// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

const express = require('express');
// Express packge
const app = express();
// Express init
const hbs = require('hbs');
// To use Handlebars we require the HBS wrapper library. 
const PORT = process.env.PORT || 3000;
// Assign port number with safe option for Heroku 
const bodyParser  = require('body-parser');
// Middleware loaded via require


app.set('view engine', 'html');
// By default, Handlebars will work with files that contain an extension matching the particular engine. 
// In our case, [something.hbs]. But we can tell Express to treat HTML files as dynamic by using 
// the "view engine" directive, you see above.

app.engine('html', hbs.__express);
// Handlebars engine config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
// Middleware init, this is for our server to interpret data sent to it.


app.use(express.static('public'));
/*  Express provides a simple way to add support for static resources like images, JavaScript libraries, 
and style sheets. By simply defining a static folder, any request for a file will be checked 
against that particular folder before being compared to routes */


var blogEngine = require('./blog');
// file where we store the object with entries and functions to retrieve them.

// ==============================================================================
// STATIC HTML/JSON
// Express apps can respond to HTTP verbs as API methods (GET, POST, DELETE and UPDATE)
// ==============================================================================

// sending a line of static HTML
app.get('/test', (req, res) => {
    res.send("<h1>It works!</h1>"); 
});

// sending a JSON object
app.get('/api', (req, res) => {
    res.send({name: "Julian", lastName: "Hasse", Age: 49, email: "info@julianhasse.com"}) 
});

// sending a static HTML file
app.get('/static', (req, res) => {
    res.sendfile("./views/static.html") 
});


// ==============================================================================
// DYNAMIC HTML WITH HANDLEBARS
// The below code effectively "starts" our server 
// ==============================================================================

app.get('/', (req, res) => {
    res.render('index',{title:"My Blog", entries:blogEngine.getBlogEntries()});
});

app.get('/about', function(req, res) {
    res.render('about', {title:"About Me"});
});
 
app.get('/article/:id', function(req, res) {
    var entry = blogEngine.getBlogEntry(req.params.id);
    res.render('article', {title:entry.title, blog:entry});
});

// res.render('something') equates to telling Express to look for views/something.html, 
// parse it based on the rules of our templating engine, and return it to the browser.



// ==============================================================================
// LISTENER
// The below code effectively "starts" our server 
// ==============================================================================

app.listen(PORT, () => {
	console.log("App listening on PORT: " + PORT);
});
