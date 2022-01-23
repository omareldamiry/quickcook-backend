require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const user = require('./routes/user');
const admin = require('./routes/admin');
const errHandler =  require('./middlewares/error-handler');
const cors = require('./middlewares/cors');
const adminSetup = require('./utilities/admin-setup');

const port = 3000;

global.prismaClient = prisma;
global.bcrypt = bcrypt;

// Sets up the default system admin
adminSetup();

// Sets up CORS headers
app.use(cors);

// Routes
app.use('/user', user);
app.use('/admin', admin);

// Error handler
app.use(errHandler);

// Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});