const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://myapp:myapp123@cluster2.fuezb.mongodb.net/books",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

var UserData = mongoose.model("user", UserSchema);
module.exports = UserData;
