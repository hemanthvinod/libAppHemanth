const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const userData = require("./src/model/userdata");
const bookData = require("./src/model/bookdata");
const path = require("path");

const PORT = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const app = new express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.static("./dist/frontend"));

app.get("/api/books", function (req, res) {
  bookData.find().then(function (books) {
    res.send(books);
    console.log(books);
  });
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  bookData.findOne({ _id: id }).then((book) => {
    res.send(book);
  });
});

app.post("/api/insert", verifyToken, (req, res) => {
  console.log(req.body.book);

  var book = {
    title: req.body.book.title,
    author: req.body.book.author,
    image: req.body.book.image,
    about: req.body.book.about,
  };
  var book = new bookData(book);
  book.save();
  res.send("Message reached");
});

app.post("/api/signupUser", (req, res) => {
  console.log(req.body);

  var newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  var user = new userData(newUser);
  user.save();
  res.send("Message reached");
});

app.post("/api/login", (req, res) => {
  let loginUser = req.body;
  var flag = false;

  userData.find().then(function (user) {
    console.log("user-db", user);
    for (let i = 0; i < user.length; i++) {
      if (
        loginUser.email == user[i].email &&
        loginUser.password == user[i].password
      ) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    console.log("flag", flag);
    if (flag == true) {
      let payload = { subject: loginUser.email + loginUser.password };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    } else {
      res.status(401).send("Invalid UserName or Password");
    }
  });
});

app.put("/api/update", (req, res) => {
  console.log("bookedit db", req.body);
  id = req.body._id;
  (title = req.body.title),
    (author = req.body.author),
    (image = req.body.image),
    (about = req.body.about),
    bookData
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            title: title,
            author: author,
            image: image,
            about: about,
          },
        }
      )
      .then(function () {
        res.send();
      });
});

app.delete("/api/remove/:id", (req, res) => {
  id = req.params.id;
  bookData.findByIdAndDelete({ _id: id }).then(() => {
    console.log("succesfully deleted");
    res.send();
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/frontend/index.html"));
});

// app.listen(3000 || process.env.PORT, () => {
//   console.log(`listening to port 3000 `);
// });

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname + "/dist/frontend/index.html"));
// });

app.listen(PORT, function () {
  console.log(`listening to port ${PORT}`);
});
