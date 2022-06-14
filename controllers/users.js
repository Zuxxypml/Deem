const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
// Initiating Database Connection
async function run() {
  await mongoose.connect(process.env.mongo_db);
}
run()
  .then((d) => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("Unable to connect to Database");
  });
// Defining Schemas
const localUserSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
});
localUserSchema.plugin(passportLocalMongoose);
localUserSchema.plugin(findOrCreate);
const googleUserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
});
googleUserSchema.plugin(passportLocalMongoose);
googleUserSchema.plugin(findOrCreate);
const facebookUserSchema = new mongoose.Schema({
  facebookId: String,
  name: String,
});
facebookUserSchema.plugin(passportLocalMongoose);
facebookUserSchema.plugin(findOrCreate);

const Google = new mongoose.model("GoogleUser", googleUserSchema);
const Facebook = new mongoose.model("FacebookUser", facebookUserSchema);
const Local = new mongoose.model("LocalUser", localUserSchema);

module.exports = {
  Google,
  Facebook,
  Local,
};
