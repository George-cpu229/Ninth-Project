//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');




const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
   title: String,
    content: String
    
};

const Article = mongoose.model("Article", articleSchema);


////////////////////////Request Targeting All Articles//////////////
//8.Creating a route for chaining handlers in order to structure and laconise my 3 methods , refactoring in one route
app.route("/articles")
    
.get(function(req, res){
   Article.find( function(err, foundArticles){
       
       if(!err){
           
        res.send(foundArticles); 
       }else {
           res.send(err);
       }
   });
})
    
.post(function(req, res){
    console.log();
   console.log();
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
  
    newArticle.save(function(err){
       if(!err) {
           res.send("Successfully added a new article.")
       }else{
           res.send(err);
       }
    });
})
    
.delete(function(req, res){
   Article.deleteMany(function(err){
       if(!err){
           res.send("Successfully deleted all articles.");
       } else {
           res.send(err);
       }
   });
})

////////////////////////Request Targeting A Specific Article//////////////

//9.Getting a request to a specific article
app.route("/articles/:articleTitle")



.get(function(req, res){
    //10. In order to operate titles of individual articles I need to type title parameters of articles
   Article.findOne(
   {title:req.params.articleTitle}, function(err, foundArticle){
       //11. In order to get good-quality function in showing title during searching, I need to make a request to a client using if statement
       if(foundArticle){
           res.send(foundArticle);
       }else{
           res.send("No articles matching that title was found.")
       }
   });
})
//12.Creating a method for updating one of articles and referring to primary section of Article(new Article)
.put(function(req, res){
  Article.update({title:req.params.articleTitle},
                 {title: req.body.title, content: req.body.content},
                {overwrite: true},//For not overwriting information
                function(err){
      if(!err){
          res.send("Successfully updated article.")
      }
    }
  );  
})

//13.Creating a method for updating one of article parameters and getting response in updating one of created in article blank-params.
.patch(function(req, res){
    Article.update({
        title: req.params.articleTitle},
        {$set: req.body},
                   function(err){
           if(!err){
               res.send("Successfully updated a part of an article.");
           } else{
               res.send(err);
     }        
    }
 );
})
//14. Creating a delete method corresponding to deleting only one article, information which goes from Robo 3T
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(!err){
           res.send("Successfully deleted article.")
        }else{
            res.send(err);
        }
    }
);  
});

//1.Create a route function to fetch all articles
//app.get("/articles", 
////        function(req, res){
////   Article.find( function(err, foundArticles){
//3.Type an if statement in order an error in not typical situation will appear
////       if(!err){
//2.Sending my articles in order my articles will be shown in localhost:3000/articles
////        res.send(foundArticles); 
////       }else {
////           res.send(err);
////       }
//       
//       
//   });
//});
//4.In order to log out my information in hyperterminal, I need to refer to WikiDB title for taking possibility for connection to Postman
//app.post("/articles", 
////         function(req, res){
////    console.log();
////   console.log();
//5.This function is resposible for appearing new database in NEST Robo 3T, so in order to post information , you need you delegate a req.body from console.log to value of new Article
////    const newArticle = new Article({
////        title: req.body.title,
////        content: req.body.content
////    });
//6.Create the save-model for getting information without ensuring in successful giving.
////    newArticle.save(function(err){
////       if(!err) {
////           res.send("Successfully added a new article.")
////       }else{
////           res.send(err);
////       }
////    });
////});
//7.Create a delete function to delete all info. from my article form
//app.delete("/articles", 
////           function(req, res){
////   Article.deleteMany(function(err){
////       if(!err){
////           res.send("Successfully deleted all articles.");
////       } else {
////           res.send(err);
////       }
////   });
////});

app.listen(3000, function(){
    console.log("Server started on port 3000")
});