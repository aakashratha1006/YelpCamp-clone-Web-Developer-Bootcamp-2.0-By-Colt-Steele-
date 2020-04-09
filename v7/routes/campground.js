var express = require('express');
var router  = express.Router();

var Campground = require('../models/campground');

router.get('/', function(req, res){
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
            res.render('campgrounds/index',{campgrounds:allCampgrounds, currentUser:req.user});
        }
    });
});

router.post('/', isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name : name, image : image, description : desc,author : author};
    // Create a new campground and save it to DB.
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);    
        }
        else{
            //Redirects back to Campgrounds page.
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

router.get('/:id', function(req, res){
    //Find the campground with that id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);    
        }
        else{
            console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show',{campgrounds:foundCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

module.exports = router;