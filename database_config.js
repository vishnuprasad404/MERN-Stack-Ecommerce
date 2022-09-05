const MongoClient = require("mongodb").MongoClient;

let state = {
  db: null,
};

module.exports.connect = (callback) => {
  try {
    MongoClient.connect(process.env.DATABASE_URI, (err, client) => {
      if (err) {
        console.log("Database Connection Faild");
      } else {
        console.log(
          `Server Connected to Database : ${process.env.DATABASE_NAME} *`
        );
        callback();
        state.db = client.db(process.env.DATABASE_NAME);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.get = () => {
  return state.db;
};
