var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/Yelp_Camp", {useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());

app.use(require('req-param'));

app.set('view engine','ejs');

//SCHEMA SETUP.
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String
});

var Campground = mongoose.model('Campground', campgroundSchema);

/*Campground.create(
    {
        name : "Salmon Creeks",
        image : "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
        description : "This is a huge campground "
    },
    function(err,Campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("NEWLY CREATED CAMPGROUND!!");
            console.log(Campground);    
        }
    }
); */ 

app.get('/',function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    /*var campgrounds = [
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
    res.render('campgrounds',{campgrounds:campgrounds});
});*/
  // Getting all Campgrounds from Database.
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds',{campgrounds:allCampgrounds});
        }
    });
});
app.post('/campgrounds', function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, image : image, description : desc};
    // Create a new campground and save it to DB.
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);    
        }
        else{
            //Redirects back to Campgrounds page.
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

app.get('/campgrounds/:id', function(req, res){
    //Find the campground with that id
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);    
        }
        else{
            res.render('show',{campgrounds:foundCampground});
        }
    });
});

app.listen(3000,function(){
    console.log("Yelpcamp Server Has Started");
});
