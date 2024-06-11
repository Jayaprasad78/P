require('./db/connection');
const model_cons = require('./schema/schema');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS setup
app.use(cors({
    origin: ["https://curdavishkaritservice.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json("Hello, home page!");
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Register Route
app.post('/reg', async (req, res) => {
    const { name, email, job, password, cpassword } = req.body;

    if (!name || !email || !job || !password || !cpassword) {
        return res.send("Kindly fill all the fields");
    }

    const emailexist = await model_cons.findOne({ email });
    if (emailexist) {
        return res.send("Email id exists, kindly register with a different email id");
    } else if (password !== cpassword) {
        return res.send("Password not matching with confirm password");
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const template = new model_cons({
            name,
            email,
            job,
            password: hashedPassword,
            cpassword: hashedPassword
        });

        await template.save();
        return res.send("Registration success");
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await model_cons.findOne({ email });

    if (!user) {
        return res.send("User not exist, kindly register first");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.send("Password incorrect");
    }

    return res.send("Signed in");
});

app.get('*', (req, res) => {
    res.send("Sorry, this page is not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



