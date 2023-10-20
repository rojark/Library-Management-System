import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

function AddBook() {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSuccessMessage(null);
    setNewBook({ ...newBook, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!newBook.title) {
      validationErrors.title = 'Please provide a title.';
    }

    if (!newBook.author || !/^[a-zA-Z\s]*$/.test(newBook.author)) {
      validationErrors.author = 'Please provide a valid author name with only alphabetical characters.';
    }

    if (!newBook.isbn || newBook.isbn.length !== 13 || isNaN(newBook.isbn) || !(parseInt(newBook.isbn)>=1000000000000 && parseInt(newBook.isbn)<= 9999999999999)) {
      validationErrors.isbn = 'Please provide a valid ISBN number (13 digits).';
    }

    if (!newBook.publicationYear || !/^\d{4}$/.test(newBook.publicationYear)) {
      validationErrors.publicationYear = 'Please provide a valid publication year (4-digit year format).';
    }

    if (!newBook.genre) {
      validationErrors.genre = 'Please select a genre.';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const addBook = () => {
    if (!validateForm()) {
      return;
    }

    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage('Book added successfully!');
          setNewBook({
            title: '',
            author: '',
            isbn: '',
            publicationYear: '',
            genre: '',
          });
          navigate("/");

        } else {
          setErrors({ isbn: 'ISBN number already exists' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1000; year--) {
    yearOptions.push(year);
  }

  return (
    <div>
      <h2 className="mb-4">Add Book</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <form>
        {errors.isbn && (
          <div className="alert alert-danger" role="alert">
            {errors.isbn}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            id="author"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
          />
          {errors.author && (
            <div className="invalid-feedback">{errors.author}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">
            ISBN
          </label>
          <input
            type="text"
            className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
            id="isbn"
            name="isbn"
            value={newBook.isbn}
            onChange={handleInputChange}
          />
          {errors.isbn && (
            <div className="invalid-feedback">{errors.isbn}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="publicationYear" className="form-label">
            Publication Year
          </label>
          <select
            className={`form-select ${errors.publicationYear ? 'is-invalid' : ''}`}
            id="publicationYear"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={handleInputChange}
          >
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.publicationYear && (
            <div className="invalid-feedback">{errors.publicationYear}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <select
            className={`form-select ${errors.genre ? 'is-invalid' : ''}`}
            id="genre"
            name="genre"
            value={newBook.genre}
            onChange={handleInputChange}
          >
            <option value="">Select Genre</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && (
            <div className="invalid-feedback">{errors.genre}</div>
          )}
        </div>
        <div className='mb-3'>
        <button type="button" className="btn btn-primary" onClick={addBook}>
          Add Book
        </button>
        <Link to="/" className="btn btn-danger" style={{ marginLeft: '20px' }}>
          Cancel
        </Link>
        </div>
      </form>
    </div>
  );
}

export default AddBook;