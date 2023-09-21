const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "serpilozdemir", password: "1qaz2wsX" },
  { username: "electra", password: "2wsx1qaZ" }
];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  console.log("Authenticated:", users.some(user => user.username === username && user.password === password));  // Debug line

  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  // console.log("Received:", username, password);  // Debug line

  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: { username } }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const booksArray = Object.values(books);
  const isbn = req.params.isbn;
  let filteredByIsbnForReview = booksArray.filter((book) => book.isbn === isbn)
  if (filteredByIsbnForReview.length > 0) {
    let filteredReview = filteredByIsbnForReview[0]["reviews"]
    let review = req.query.review;
    if(review){
      filteredReview.review = review;
    }
    booksArrays = booksArray.filter((book) => book.reviews != review);
    booksArrays.push(filteredReview);
    return res.send(`Book review with the isbn ${isbn} updated.`)
  }
  else{
    res.send("Unable to find book with this isbn!");

  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const booksArray = Object.values(books);
  const isbn = req.params.isbn;
  let filteredByIsbnForReview = booksArray.filter((book) => book.isbn === isbn)
  if (filteredByIsbnForReview.length > 0) {
    let filteredReview = filteredByIsbnForReview[0]["reviews"]
    if(filteredReview){
      delete filteredReview.review;
    }
    return res.send(`Book review with the isbn ${isbn} deleted.`)
  }
  else{
    res.send("Unable to find book with this isbn!");
  }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
