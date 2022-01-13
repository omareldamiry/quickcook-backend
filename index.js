const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const user = require('./routes/user');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const port = 3000;

app.use(bodyParser.json())

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