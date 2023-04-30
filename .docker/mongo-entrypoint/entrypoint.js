const db = connect('mongodb://localhost:27017/incubator-nest');

db.createUser({
  user: 'testUser',
  pwd: 'testPassword',
  roles: [{ role: 'readWrite', db: 'incubator-nest' }],
});
