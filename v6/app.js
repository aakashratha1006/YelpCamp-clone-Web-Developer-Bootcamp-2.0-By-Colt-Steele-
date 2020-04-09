var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var LocalStrategy   = require('passport-local');
var Campground      = require('./models/campground');
var User            = require('./models/user');
var Comment         = require('./models/comment');
var seedDB          = require('./seeds'); 

var commentRoutes    = require('./routes/comment');
var campgroundRoutes = require('./routes/campground');
var indexRoutes      = require('./routes/index');


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
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

app.listen(3000,function(){
    console.log("Yelpcamp Server Has Started");
});
