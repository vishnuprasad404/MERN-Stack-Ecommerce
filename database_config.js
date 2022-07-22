const MongoClient = require("mongodb").MongoClient;

let state = {
  db: null,
};

module.exports.connect = () => {
  MongoClient.connect(process.env.DATABASE_URI, (err, client) => {
    if (err) {
      console.log("Database Connection Faild");
      console.log(err);
    } else {
      console.log(
        `Server Connected to Database : ${process.env.DATABASE_NAME} *`
      );
      state.db = client.db(process.env.DATABASE_NAME);
    }
  })
};

module.exports.get = () => {
  return state.db;
};
