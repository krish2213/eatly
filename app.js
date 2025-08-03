if(process.env.NODE_ENV!=='production'){
require('dotenv').config();
}
const express = require('express')
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride= require('method-override')
const ExpressError = require('./utils/ExpressError')
const foodzonesRoutes = require('./routes/foodzones')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')
const User = require('./models/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/eatly";
const MongoStore = require("connect-mongo");
const mongoSecret = process.env.MONGO_SECRET || 'SecretCode';
const sessionSecret = process.env.SESSION_SECRET || 'SecretCode';
const PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '))
db.once("open", () => {
    console.log("Database connected");
})

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, 
    crypto: {
        secret: mongoSecret
    }
});

store.on("error",function(e){
    console.log("Session store error",e)
})

const sessionConfig = {
    store,
    name:'sessioninfo',
    secret : sessionSecret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly : true     
    }

}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
    "https://fonts.googleapis.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
    
  "https://cdnjs.cloudflare.com/", 
];
const connectSrcUrls = [
    "https://api.maptiler.com/", 
    "https://fonts.googleapis.com/",
];
const fontSrcUrls = [
  "https://cdnjs.cloudflare.com/",

];
app.use(helmet.contentSecurityPolicy({
    directives :{
        defaultSrc : [],
        connectSrc : ["'self'",...connectSrcUrls],
        scriptSrc : ["'unsafe-inline'","'self'",...scriptSrcUrls],
        styleSrc : ["'self'","'unsafe-inline'",...styleSrcUrls],
        workerSrc : ["'self'","blob:"],
        objectSrc : [],
        imgSrc : [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/daa8rlgex/",
            "https://api.maptiler.com/",
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
      fontSrc: ["'self'", ...fontSrcUrls],  
    },
})
);

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',usersRoutes)
app.use('/foodzones',foodzonesRoutes);
app.use('/foodzones/:id/reviews',reviewsRoutes)




app.get('/', (req, res) => {
    res.render('home');
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err });
})

app.listen(PORT, () => {
    console.log("We are listening!");
})
