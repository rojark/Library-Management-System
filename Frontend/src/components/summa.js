
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const textstyle = {
  fontWeight: 'bold',
};
const genreOptions = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Thriller',
  'Horror',
  'Biography',
  'Self-Help',
  'Other',
];

function EditBooks() {
  const [searchKey, setSearchKey] = useState('');
  const [bookData, setBookData] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearchKeyChange = (e) => {
    setSearchKey(e.target.value);
    setBookData([]);
    setSearchError('');
    setValidationError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage('');
    setBookData((prevData) => {
      const index = e.target.getAttribute('data-index');
      if (index !== null) {
        prevData[index][name] = value;
        prevData[index].edited = true; 
      }
      return [...prevData];
    });
    setValidationError('');
  };

  const validateSearchKey = () => {
    if (!searchKey) {
      setSearchError('Please provide a title or ISBN.');
      return false;
    } else if (!/^\d{13}$/.test(searchKey) && !/^[a-zA-Z\s]*$/.test(searchKey)) {
      setSearchError('Please provide a valid title or 13-digit ISBN.');
      return false;
    }
    return true;
  };

  const searchAndFetchBook = async () => {
    if (!validateSearchKey()) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/bookdetails/${searchKey}`);
      console.log('Response data:', response.data);
      setBookData(response.data.map((book) => ({ ...book, edited: false }))); // Mark all forms as not edited
    } catch (error) {
      console.error('Error fetching book data:', error);
      setSearchError('No data available for the title or ISBN.');
      setBookData([]);
    }
  };

  const editBook = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const booksToUpdate = bookData
        .filter((book) => book.edited)
        .map((book) => ({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publicationYear: book.publicationYear,
          genre: book.genre,
        }));

      const response = await axios.put('http://localhost:5000/api/editBook', {
        books: booksToUpdate,
      });

      setBookData([]);
      setSuccessMessage('Books updated successfully!');
      setValidationError('');
   
    } catch (error) {
      console.error('Error editing books:', error);
      setValidationError('Error editing books. Please try again.');
    }
  };

  const validateFields = () => {
    if (bookData.length === 0) {
      setValidationError('No books to edit. Please search for a book first.');
      return false;
    }

    for (const book of bookData) {
      if (book.edited) {
        if (!book.title) {
          setValidationError('Please provide a title for all edited books.');
          return false;
        }
        if (!/^[a-zA-Z\s]*$/.test(book.author)) {
          setValidationError('Please provide a valid author name with only alphabetical characters for all edited books.');
          return false;
        }
        if (!/^\d{13}$/.test(book.isbn)) {
          setValidationError('Please provide a valid 13-digit ISBN number for all edited books.');
          return false;
        }
        if (!/^\d{4}$/.test(book.publicationYear)) {
          setValidationError('Please provide a valid publication year (4-digit year format) for all edited books.');
          return false;
        }
        if (!book.genre) {
          setValidationError('Please select a genre for all edited books.');
          return false;
        }
      }
    }

    return true;
  };
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1000; year--) {
    yearOptions.push(year);
  }

  useEffect(() => {
    setBookData([]);
    setSearchError('');
    setValidationError('');
    setSuccessMessage('');
  }, [searchKey]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Books</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
     ) }

      <input type="text" className="form-control mb-3" placeholder="Search by ISBN or Title" onChange={handleSearchKeyChange} />
      <button type="button" className="btn btn-primary" onClick={searchAndFetchBook}>
        Search and Fetch Book
      </button>

      {searchError && <div className="alert alert-danger mt-3">{searchError}</div>}

      {bookData.length > 0 && (
        <div className="row">
          {bookData.map((book, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label" style={textstyle}>
                      Title
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationError && validationError.includes('title') ? 'is-invalid' : ''}`}
                      name="title"
                      data-index={index}
                      value={book.title}
                      onChange={handleInputChange}
                    />
                    {validationError && validationError.includes('title') && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label" style={textstyle}>
                      Author
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationError && validationError.includes('author') ? 'is-invalid' : ''}`}
                      name="author"
                      data-index={index}
                      value={book.author}
                      onChange={handleInputChange}
                    />
                    {validationError && validationError.includes('author') && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="isbn" className="form-label" style={textstyle}>
                      ISBN
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationError && validationError.includes('isbn') ? 'is-invalid' : ''}`}
                      name="isbn"
                      data-index={index}
                      value={book.isbn}
                      onChange={handleInputChange}
                    />
                    {validationError && validationError.includes('isbn') && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="publicationYear" className="form-label" style={textstyle}>
                      Publication Year
                    </label>
                    <select
                      className={`form-select ${validationError && validationError.includes('publicationYear') ? 'is-invalid' : ''}`}
                      name="publicationYear"
                      data-index={index}
                      value={book.publicationYear}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {validationError && validationError.includes('publicationYear') && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="genre" className="form-label" style={textstyle}>
                      Genre
                    </label>
                    <select
                      className={`form-select ${validationError && validationError.includes('genre') ? 'is-invalid' : ''}`}
                      name="genre"
                      data-index={index}
                      value={book.genre}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Genre</option>
                      {genreOptions.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                    {validationError && validationError.includes('genre') && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => editBook(book.isbn)} // Pass the original ISBN to the editBook function
                  >
                    Edit Books
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditBooks;