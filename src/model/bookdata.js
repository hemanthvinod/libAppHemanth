const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://myapp:myapp123@cluster2.fuezb.mongodb.net/books",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const Schema = mongoose.Schema;

var NewBookSchema = new Schema({
  title: String,
  author: String,
  image: String,
  about: String,
});

var Bookdata = mongoose.model("book", NewBookSchema);
module.exports = Bookdata;
