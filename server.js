
const express=require("express");

const app=express();

const shortId=require("shortid");


const mongoose=require("mongoose");
const User=require('./model');
mongoose.connect("mongodb://localhost/urlDb");

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async(req,res)=>{
    try{
     res.render('index');
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
      }
})


app.post('/post1',async(req,res)=>{
    try{
        const chk= await User.findOne({longurl: req.body.fullUrl});
 
        if(chk==null){
            
     const add= await User.create({shorturl: shortId.generate() ,longurl: req.body.fullUrl,clicks:0});
     add.save();
     return res.render('index',{urls: add.shorturl})
        }
       
       return res.render('index',{urls:chk.shorturl});
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
      }
});

app.get('/:short', async(req,res)=>{
      try{
    const s=req.params.short;
    const check=await User.findOne({shorturl:s});
    if(check==null){
        res.sendStatus(404)
        return
    }
    check.clicks++;
    check.save();
    
    res.redirect(check.longurl);
} catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
})


app.listen(3000,()=>{
    console.log("Server started")
})


