const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});

const Note = conn.define('note',{
  text: Sequelize.TEXT
});

Note.belongsTo(User);

User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    const hashed = await bcrypt.hash(user.password, 3);
    user.password = hashed;
  }
});

User.byToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(payload.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if(user){
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

User.authenticate = async({ username, password })=> {
  const user = await User.findOne({
    where: {
      username
    }
  });
  if(user && await bcrypt.compare(password, user.password) ){
    return jwt.sign({ id: user.id}, process.env.JWT); 
  }
  const error = Error('bad credentials!!!!!!');
  error.status = 401;
  throw error;
};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );

  await Promise.all([
    Note.create({text: '“I knew you’d linger like a tattoo kiss. I knew you’d haunt all of my what ifs.”',userId: lucy.id}),
    Note.create({text: '“To live for the hope of it all, cancel plans just in case you’d call.”', userId: lucy.id}),
    Note.create({text: '“If I’m dead to you why are you at the wake?”', userId: lucy.id}),
    Note.create({text: '“And women like hunting witches too, doing your dirtiest work for you.”', userId: lucy.id}),
    Note.create({text: '“Your faithless love’s the only hoax I believe in.”', userId: larry.id}),
    Note.create({text: '“In my defense, I have none, for never leaving well enough alone.”', userId: larry.id}),
    Note.create({text: '“I can go anywhere I want. Anywhere I want, just not home.”', userId: larry.id}),
    Note.create({text: '“When I felt like I was an old cardigan under someone’s bed, you put me on and said I was your favorite.”', userId: moe.id})
  ]);

  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Note
  }
};
