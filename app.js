const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const ejs = require('ejs');
require('dotenv').config();

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true})); //for requests
app.use(express.static('public')); //using public directory to store static files like images,css


//setting up mongodb
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('article',articleSchema);


/////////////////////Requests targetting ALL articiles ////////////////////////////


app.get('/articles',function(req,res){
    Article.find(function(err,foundArticles){
        // console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    })
});

//here using Postman
app.post('/articles',function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send('Successfully added new document!');
        }else{
            res.send(err);
        }
    });
});


app.delete('/articles',function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send('Successfully deleted all articles.');
        }else{
            res.send(err);
        }
    })
});


/////////////////////Requests targetting SPECIFIC articiles ////////////////////////////
//Using express chained route handlers + route parameters

app.route('/articles/:articleTitle')

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        }else{
            res.send(err);
        }
    })

})

.put(function(req,res){
    Article.replaceOne({title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        function(err,results){
            if(!err){
                res.send('successfully updated article!');
            }else{
                res.send(err);
            }
        }
        )
})

.patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle}, req.body, function(err,results){
        if(!err){
            res.send('Article has been updated!');
        }else{
            res.send(err);
        }
    })
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err,results){
        if(!err){
            res.send('Article deleted.');
        }else{
            res.send(err)
        }
    })
})


app.listen(3000,function(){
    console.log('Server started on port 3000');
})