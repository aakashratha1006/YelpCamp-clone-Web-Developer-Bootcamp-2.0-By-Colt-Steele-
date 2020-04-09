var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {
        name        : "Cloud's Rest",
        image       : "https://californiathroughmylens.com/wp-content/uploads/2017/07/clouds-rest-20-640x427.jpg",
        description : "blah blah blah........."
    },
    {
        name        : "Desert Mesa",
        image       : "https://cache.desktopnexus.com/thumbseg/1184/1184739-bigthumbnail.jpg",
        description : "blah blah blah........."
    },
    {
        name        : "Canyon Floor",
        image       : "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/grand-canyon-floor-iii-mary-haber.jpg",
        description : "blah blah blah........."
    }
]


function seedDB(){
    
    // Remove all Campgrounds. 
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campgrounds!!!");
        // Add a few Campgrounds.
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Added a Campground");
                    // Create a Comment
                    Comment.create({
                        text   : "This place is great, but I wish there was internet",
                        author : "Homer"
                    },function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a New Comment");
                        }
                    });
                }
            });
        });
    }); 

    // ADD A FEW COMMENTS....
}
    
module.exports = seedDB;