module.exports = async () => {
    const allAdmins = await global.prismaClient.admin.findMany({
      select: {
        username: true,
      }
    });
  
    if(allAdmins.length == 0){
      const password = "pass";
      const salt = 10;

      const hashed = await global.bcrypt.hash(password, salt);

      await global.prismaClient.admin.create({
        data: {
          username: 'admin',
          password: hashed,
        }
      });
    }
  }