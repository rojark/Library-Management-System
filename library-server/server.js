const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

mongoose.connect('mongodb://localhost:27017/library-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: { type: String, unique: true },
  publicationYear: Number,
  genre: String,
});

const Book = mongoose.model('Book-data', bookSchema);

app.post('/api/books', (req, res) => {
    const { title, author, isbn, publicationYear, genre } = req.body;
  
    const newBook = new Book({
      title,
      author,
      isbn,
      publicationYear,
      genre,
    });
  
    newBook
      .save()
      .then(() => {
        console.log('Book added successfully');
        res.json({ message: 'Book added successfully', success: true });
      })
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key (ISBN) error
          console.error('ISBN already exists:', err);
          res.status(409).json({ error: 'ISBN number already exists', success: false });
        } else {
          console.error('Error saving book:', err);
          res.status(500).json({ error: 'Failed to add the book', success: false });
        }
      });
  });
  
app.get('/api/books', (req, res) => {
    // Use the Book model to fetch all book records from MongoDB
    Book.find({})
      .exec()
      .then(books => {
        // If books are found, send them as a JSON response
        res.json(books);
      })
      .catch(err => {
        // If there's an error, send an error response
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
      });
  });
  app.put('/api/editBook', async (req, res) => {
    const books = req.body;
    console.log(books,'books');
  
    try {
      
        const book = await Book.findOne({ isbn: books.isbn });
  
        if (!book) {
          return { error: 'Book not found' };
        }
  
        // Update the book's properties
        if (books.title) {
          book.title = books.title;
        }
  
        if (books.author) {
          book.author = books.author;
        }
  
        if (books.isbn) {
          book.isbn = books.isbn;
        }
  
        if (books.publicationYear) {
          book.publicationYear = books.publicationYear;
        }
  
        if (books.genre) {
          book.genre = books.genre;
        }
  
        const updatedBook = await book.save();
        console.log(updatedBook);
  
        // return { message: 'Book updated successfully', updatedBook };
        
        res.json({message: 'Book updated successfully successfully', UpdatedBook: updatedBook, success:true});
      }
     catch (err) {
      console.error('Error updating books:', err);
      return res.status(500).json({ error: 'Failed to update books' });
    }
  });
  
  
  
  app.get('/api/bookdetails/:searchKey', async (req, res) => {
    const searchKey = req.params.searchKey;
  
    try {
      const book = await Book.find({ $or: [{ isbn: searchKey }, { title: searchKey }] });
  
      if (!book || book.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      const bookArray = Array.isArray(book) ? book : [book];
      console.log(bookArray);
      res.json(bookArray);
    } catch (err) {
      console.error('Error finding the book:', err);
      res.status(500).json({ error: 'Failed to find the book' });
    }
  });
  app.delete('/api/deleteBook/:searchKey', async (req, res) => {
    const searchKey = req.params.searchKey;
  
    try {
      // Find and delete the book based on the searchKey (ISBN or Title)
      const result = await Book.deleteOne({ $or: [{ isbn: searchKey }, { title: searchKey }] });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.json({ message: 'Book deleted successfully' });
    } catch (err) {
      console.error('Error deleting the book:', err);
      return res.status(500).json({ error: 'Failed to delete the book' });
    }
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
