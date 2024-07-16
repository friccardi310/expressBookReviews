const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "edharad", password: "pwd12"}];

const isValid = (username)=>{ //returns boolean

    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
        } else {
         return false;
        }
    //write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        console.log(accessToken)

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req)
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username; 

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); 
    }

    const book = books[isbn];

    if (book) {
      book.reviews[username] = review; 
      res.json({ message: "Review added/modified successfully" });
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding/modifying review" }); // Handle unexpected errors
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => { 
    try {
        const isbn = req.params.isbn;
        const review = req.query.review;
        const username = req.session.authorization.username; 
    
        if (!username) {
          return res.status(401).json({ message: "Unauthorized" }); 
        }
    
        const book = books[isbn];
    
        if (book) {
          delete book.reviews[username] ; 
          res.json({ message: "Review deleted successfully" });
        } else {
          res.status(404).json({ message: "Book not found" }); // Handle book not found
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting review" }); // Handle unexpected errors
      }
    
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
