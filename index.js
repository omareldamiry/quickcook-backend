require('dotenv').config();
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const user = require('./routes/user');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const port = 3000;

global.prismaClient = prisma;
global.bcrypt = bcrypt;

// app.prisma = prisma;
// prisma1 = prisma;
// app.bcrypt = bcrypt;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

async function main() {
  const allAdmins = await prisma.admin.findMany();

  if(allAdmins.length == 0){
    const password = "pass";
    const salt = 10;
    bcrypt.hash(password, salt, async (err, hashed) => {
      if(err) throw err;

      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashed,
        }
      });
    });
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/user', user);

app.use((err, req, res, next) => {
 
    console.log(`Custom Try Catch : ${err.message}`);
    res.status(500).json({
      message: `Error: ${err.message}`
    });
  
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

main()
.catch(e => {
  //TODO Proper error handling on Prisma Client
  throw e;
})
.finally(async () => {
  await prisma.$disconnect();
});