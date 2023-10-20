import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate= useNavigate();

  const handleSearchKeyChange = (e) => {
    setSearchKey(e.target.value);
    setBookData([]);
    setSelectedBook(null);
    setSearchError('');
    setValidationError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage('');
    setValidationError('');
    if (name === 'author') {
      // Check if the value contains only alphabetic characters and spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setValidationError('Author name should not contain numbers or special characters.');
      } 
    }
   
    setSelectedBook((prevSelectedBook) => ({
      ...prevSelectedBook,
      [name]: value,
    }));
  };

  const searchAndFetchBook = async () => {
    if (!searchKey) {
      setSearchError('Please provide a title or ISBN.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/bookdetails/${searchKey}`);
      setBookData(response.data);
      setSearchError('');
      setSelectedBook(null);
    } catch (error) {
      console.error('Error fetching book data:', error);
      setSearchError('No data available for the title or ISBN.');
      setBookData([]);
      setSelectedBook(null);
    }
  };

  const editBook = async () => {
    if (!validateFields(selectedBook)) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/editBook`, {
        title: selectedBook.title,
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        publicationYear: selectedBook.publicationYear,
        genre: selectedBook.genre,
      });

      setSuccessMessage('Book updated successfully!');
     
      setValidationError('');
      setTimeout(() => {
        navigate(-1);
      }, 2000); 
    } catch (error) {
      console.error('Error editing book:', error);
      setValidationError('Error editing the book. Please try again.');
    }
  };

  const validateFields = (book) => {
    if (!book.title) {
      setValidationError('Please provide a title.');
      return false;
    }
    if (!book.author || !/^[a-zA-Z\s]*$/.test(book.author)) {
      setValidationError('Please provide a valid author.');
      return false;
    }
    if (!book.isbn) {
      setValidationError('Please provide an ISBN.');
      return false;
    }
    if (!book.publicationYear) {
      setValidationError('Please provide a publication year.');
      return false;
    }
    if (!book.genre) {
      setValidationError('Please select a genre.');
      return false;
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
    setSelectedBook(null);
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
      )}
      <input type="text" className="form-control mb-3" placeholder="Search by ISBN or Title" onChange={handleSearchKeyChange} />
      <button type="button" className="btn btn-primary" onClick={searchAndFetchBook}>
        Search
      </button>
      <Link to="/" className="btn btn-danger"style={{ marginLeft: '20px' }}>
        Cancel
      </Link>
      {searchError && <div className="alert alert-danger mt-3">{searchError}</div>}
      {bookData.length > 0 && !selectedBook && (
        <div className="row">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Publication Year</th>
                <th>Genre</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {bookData.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.genre}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setSelectedBook(book)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedBook && (
        <div>
          <h5 className='text-center'>ISBN : {selectedBook.isbn}</h5>
          <div className="mb-3">
            <label htmlFor="title" className="form-label" style={textstyle}>
              Title
            </label>
            <input
              type="text"
              className={`form-control ${validationError ? 'is-invalid' : ''}`}
              name="title"
              value={selectedBook.title}
              onChange={handleInputChange}
            />
            {validationError.title && (
              <div className="invalid-feedback">Please provide a title.</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="form-label" style={textstyle}>
              Author
            </label>
            <input
              type="text"
              className={`form-control ${validationError  ? 'is-invalid' : ''}`}
              name="author"
              value={selectedBook.author}
              onChange={handleInputChange}
            />
            {validationError  && (
              <div className="invalid-feedback">Please provide a valid author.</div>
            )}
          </div>
          {/* <div className="mb-3">
            <label htmlFor="isbn" className="form-label" style={textstyle}>
              ISBN
            </label>
            <input
              type="text"
              className="form-control"
              name="isbn"
              value={selectedBook.isbn}
              readOnly
              disabled
            />
          </div> */}
          <div className="mb-3">
            <label htmlFor="publicationYear" className="form-label" style={textstyle}>
              Publication Year
            </label>
            <select
              className={`form-select ${validationError  ? 'is-invalid' : ''}`}
              name="publicationYear"
              value={selectedBook.publicationYear}
              onChange={handleInputChange}
            >
              <option value="">Select Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {validationError.publicationYear && (
              <div className="invalid-feedback">Please provide a publication year.</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="genre" className="form-label" style={textstyle}>
              Genre
            </label>
            <select
              className={`form-select ${validationError ? 'is-invalid' : ''}`}
              name="genre"
              value={selectedBook.genre}
              onChange={handleInputChange}
            >
              <option value="">Select Genre</option>
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {validationError.genre  && (
              <div className="invalid-feedback">Please select a genre.</div>
            )}
          </div>
          <button type="button" className="btn btn-primary" onClick={editBook} style={{ marginLeft: '20px' }}>
            Update 
          </button>
          <Link to="/" className="btn btn-danger"style={{ marginLeft: '20px' }}>
           Cancel
          </Link>
        </div>
      )}
      
    </div>
  );
}

export default EditBooks;
