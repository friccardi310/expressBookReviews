const express = require('express');
let books = require("./booksdb.js");
const { restart } = require('nodemon');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try {
    res.json(books); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn];
    if (book) {
      res.json(book); // Send the book details as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" }); 
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const bookKeys = Object.keys(books) //retrieve book by author
    const matchBooks = []

    for (const key of bookKeys) {
        const book = books[key];
        if (book.author.toLowerCase() === author.toLowerCase()) {
          matchBooks.push(book);
        }
      }
    
      if (matchBooks.length > 0) {
        res.json(matchBooks)
      } else {
        res.status(404).send({ message : "Book not found by this author"})
      }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message : "No book found with this author"}) // Handle unexpected errors
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title ;
  const matchBooks = [] ;
  const bookKeys = Object.keys(books);
try {
  for(const key of bookKeys) {
    const book = books[key]
    if(book.title.toLowerCase() === title.toLowerCase()) {
        matchBooks.push(book)
    }
  }

  if(matchBooks.length > 0) {
    res.json(matchBooks);
  } else {
    res.status(404).json({ message : "No book found with this title"});
  }


} catch (error){
    console.error(error);
    res.status(500).json({ message : "Error retrieving book by title"})
}
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  try {
    const isbn = req.params.isbn;
    const book = books[isbn]

    if(book) {
        const review = book.reviews
        res.json(review)
    } else {
        res.status(404).json({message: "Reviews not found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message : "Error retrieving reviews by ISBN"});
  }

});

module.exports.general = public_users;
