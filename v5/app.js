var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Campground = require('./models/campground');
var User = require('./models/user');
var Comment = require('./models/comment');
var seedDB = require('./seeds'); 

mongoose.connect("mongodb://localhost/Yelp_Camp", {useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());

app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));

seedDB();
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

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret : "Yoooo aakash here....",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

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
            res.render('campgrounds/index',{campgrounds:allCampgrounds, currentUser:req.user});
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

// COMMENTS ROUTE...................

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate("local",
{
    successRedirect : "/campgrounds",
    failureRedirect : "/login" 
}), function(req, res){
});

app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

app.listen(3000,function(){
    console.log("Yelpcamp Server Has Started");
});
