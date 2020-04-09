var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelpcamp_blog_demo_2');
var Post = require('./models/posts');
var User = require('./models/user');

/*User.create({
    email : "bob123@gmail.com",
    name  : "Bob Belcher"
});*/

Post.create({
    title   : "How to Cook the best burger pt.4",
    content : "lolllllllzzzzzzzz"
}, function(err,post){
    User.findOne({email : "bob123@gmail.com"}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            foundUser.posts.push(post);
            foundUser.save(function(err, data){
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });
        }
    });
}); 

// FIND USER
// FIND ALL POSTS FOR THAT USER

/*User.findOne({email : "bob123@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    }
    else{
        console.log(user);
    }
});
*/
