module.exports = async () => {
    const allAdmins = await global.prismaClient.admin.findMany({
      select: {
        username: true,
      }
    });
  
    if(allAdmins.length == 0){
      const password = "pass";
      const salt = 10;
      
      bcrypt.hash(password, salt, async (err, hashed) => {
        if(err) throw err;
  
        await global.prismaClient.admin.create({
          data: {
            username: 'admin',
            password: hashed,
          }
        });
      });
    }
  }