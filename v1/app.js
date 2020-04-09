var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var campgrounds = [
    {name : "Salmon Creeks", image : "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"},
    {name : "Granite Hill", image : "https://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"},
    {name : "Daisy Mountain", image : "https://3.bp.blogspot.com/-IsrZ3F3cPE4/VB42AqkxQkI/AAAAAAAASUI/0bFQSJV8haY/s1600/20140913_071753.jpg"},
    {name : "Salmon Creeks", image : "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"},
    {name : "Granite Hill", image : "https://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"},
    {name : "Daisy Mountain", image : "https://3.bp.blogspot.com/-IsrZ3F3cPE4/VB42AqkxQkI/AAAAAAAASUI/0bFQSJV8haY/s1600/20140913_071753.jpg"},
    {name : "Salmon Creeks", image : "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"},
    {name : "Granite Hill", image : "https://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"},
    {name : "Daisy Mountain", image : "https://3.bp.blogspot.com/-IsrZ3F3cPE4/VB42AqkxQkI/AAAAAAAASUI/0bFQSJV8haY/s1600/20140913_071753.jpg"}
];
app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());

app.set('view engine','ejs');

app.get('/',function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    res.render('campgrounds',{campgrounds:campgrounds});
});

app.post('/campgrounds', function(req,res){  
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name : name, image : image};
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

app.listen(3000,function(){
    console.log("Yelpcamp Server Has Started");
});

