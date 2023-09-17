const express = require("express");
const path = require("path");
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.use(express.static(path.join(__dirname,'engine')));

app.use('/', function(req, res, next){
    console.log("A new request received at " + Date.now());
    next();
 });

app.get('/', function(req, res){
    res.render("index.html");
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});