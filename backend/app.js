const express = require('express');
const path = require('path');
const cookiePaser = require('cookie-parser')
const app = express();
require('dotenv').config()
const helmet = require("helmet");
const userRoutes = require('./routes/userRoutes')
const postsRoutes = require('./routes/postsRoutes')
const commentsRoutes = require('./routes/commentsRoutes')



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.cookie
    next();
});

app.use(express.json())
app.use(helmet());
app.use(cookiePaser())



app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/user', userRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/posts/comments', commentsRoutes)

module.exports = app;