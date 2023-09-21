const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require('axios');
let users = require("./auth_users.js").users;
const public_users = express.Router();

const app = express();

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

mock.onGet('/books').reply(200, books);

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const existingUser = users.some(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user
  users.push({ username, password });

  // Optionally, you might want to save 'users' to a database here

  return res.status(201).json({ message: "User successfully registered", username });
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.send(books);
// });

public_users.get('/', async (req, res) => {
  const response = await axios({
    method: 'get',
    url: '/simulate',
    adapter: (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({data: books, status: 200});
        }, 1000);
      });
    }
  });
  res.json(response.data);
});




//Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const response = await axios({
    method: 'get',
    url: '/simulate',
    adapter: (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({data: books, status: 200});
        }, 1000);
      });
    }
  });
  const booksArray = Object.values(response.data);
  const isbn = req.params.isbn;
  let filtered_isbn = booksArray.filter((book) => book.isbn === isbn);
  return  res.send(filtered_isbn);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const response = await axios({
    method: 'get',
    url: '/simulate',
    adapter: (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({data: books, status: 200});
        }, 1000);
      });
    }
  });
  const booksArray = Object.values(response.data);
  const author = req.params.author;
  let filteredByAuthor = booksArray.filter((book) => book.author === author);
  return res.send(filteredByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const response = await axios({
    method: 'get',
    url: '/simulate',
    adapter: (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({data: books, status: 200});
        }, 1000);
      });
    }
  });
  const booksArray = Object.values(response.data);
  const title = req.params.title;
  let filteredByTitle = booksArray.filter((book) => book.title === title);
  return res.send(filteredByTitle);
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const response = await axios({
    method: 'get',
    url: '/simulate',
    adapter: (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({data: books, status: 200});
        }, 1000);
      });
    }
  });
  const booksArray = Object.values(response.data);
  const isbn = req.params.isbn;
  let filteredIsbnForReview = booksArray.filter((book) => book.isbn === isbn);
  if (filteredIsbnForReview.length > 0) {
    return res.send(filteredIsbnForReview[0]["reviews"]);
} else {
    return res.status(404).json({ message: "Book not found" });
}
});


module.exports.general = public_users;
