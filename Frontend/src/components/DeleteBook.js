import React, { useState } from 'react';
import axios from 'axios';

function DeleteBook() {
  const [searchKey, setSearchKey] = useState('');
  const [bookData, setBookData] = useState([]);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage]=useState('')

  const handleSearchKeyChange = (e) => {
    setSearchKey(e.target.value);
  };

  const searchAndFetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookdetails/${searchKey}`);
      setBookData(response.data);
      setDeleteError('');
    } catch (error) {
      console.error('Error fetching book data:', error);
      setDeleteError('No data available for the title or ISBN.');
      setBookData([]);
    }
  };

  const deleteBook = async (isbn) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteBook/${isbn}`);
      console.log('Book deleted successfully');
      setSuccessMessage('Record deleted successfully')
      setBookData([]);
      setDeleteError('');
    } catch (error) {
      console.error('Error deleting book:', error);
      setDeleteError('Error deleting the book. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Delete Book</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <input type="text" className="form-control mb-3" placeholder="Search by ISBN or Title" onChange={handleSearchKeyChange} />
      <button type="button" className="btn btn-primary" onClick={searchAndFetchBook}>
        Search and Fetch Book
      </button>

      {bookData.length > 0 && (
        <div>
          {bookData.map((book) => (
            <div key={book.isbn} className="card mb-3">
              <div className="card-body">
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p>Publication Year: {book.publicationYear}</p>
                <p>Genre: {book.genre}</p>
                <p>ISBN: {book.isbn}</p>
                <button type="button" className="btn btn-danger" onClick={() => deleteBook(book.isbn)}>
                  Delete Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteError && <div className="alert alert-danger mt-3">{deleteError}</div>}
    </div>
  );
}

export default DeleteBook;
