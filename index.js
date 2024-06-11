require('./db/connection')
const model_cons = require('./schema/schema')

const bc=require('bcrypt')

const E = require('express')
const app = E();
const bp = require('body-parser')
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json())

const path=require('path')
const ejs=require('ejs')
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))
// app.use(E.static(path.join(__dirname, 'public')));


app.get('/',(req,res)=>{
  res.json("hello home page");
})


app.get('/home', (req, res) => {
   res.render('home')
})

app.get('/signin', (req, res) => {
   res.render('signin')
})
app.get('/signup', (req, res) => {
   res.render('signup')
})

//Register Route
app.post('/reg',async(req, res) => {

   if(!req.body.name || !req.body.email || !req.body.job || !req.body.password || !req.body.cpassword)
      {
         return  res.send("kindly fill all the felids")
      }

   const emailexist =  await model_cons.findOne({ email: req.body.email})
   if(emailexist)
      {
         return res.send("email id is exist ,kindly register with different email id")
      }
   else if(req.body.password != req.body.cpassword )
      {
         return res.send("password not matching with conifrm password")
      }
      else
      {


         const name = req.body.name
         const email = req.body.email
         const job = req.body.job
         const password = req.body.password
         const cpassword = req.body.cpassword


         console.log(name)
         // const hashedpassword=  await bc.hash(password,10)

         const template = model_cons({
            name,
            email,
            job,
            password,
            cpassword
         })
         template.save()
         return res.send("registration sucess")
      }
})

//Login Route
app.post('/login', async(req,res) => {
   const emailexist=  await model_cons.findOne({email:req.body.email})
   // const password_match= bp.compare(req.body.password,emailexist.password)
   if(!emailexist)
      {
         return res.send("user not exist ,kindly register first")
      }
   else if (req.body.password!=emailexist.password)
      {
         return res.send("password incorrect")
      }
      else
      {
         return res.send("singed in ")
      } 
})

app.get('*',(req,res)=>{
   res.send(" sorry this page is not found")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log("my server is running on 3000 port")
})



