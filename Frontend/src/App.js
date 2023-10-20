import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddBook from './components/AddBook';
import DisplayBooks from './components/DisplayBook';
import EditBooks from './components/EditBook';
import DeleteBook from './components/DeleteBook';


const titleStyle = {
  textAlign: 'center',
  marginLeft: '20px',
  marginRight: '20px',
  marginTop: '5px',
};

const linkStyle = {
 
  display: 'flex',
  justifyContent: 'center',

};
const cardStyle={
  
  

}

const colorstyle={
  backgroundColor:"#9F6BA0",
  color:"white",
};
const linkContainer = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

function Home() {
  return (
    <div>
      <h1 style={titleStyle}>Library Management System</h1>
      <div className="mt-5" style={linkContainer}>
        <div className="card" style={cardStyle}>
          <img src="./images//addbook.jpeg" alt="Add Book" style={{ width: '200px', margin: 'auto' }} />
          <Link to="/add" className="btn d-block mt-2" style={colorstyle}>
            Add Book
          </Link>
        </div>

        <div className="card" style={cardStyle}>
          <img src="./images//display.jpeg" alt="Display Books" style={{ width: '200px', margin: 'auto' }} />
          <Link to="/display" className="btn btn-success d-block mt-2">
            Display Books
          </Link>
        </div>

        <div className="card" style={cardStyle}>
          <img src="./images//edit.jpeg" alt="Edit Books" style={{ width: '200px', margin: 'auto' }} />
          <Link to="/edit" className="btn btn-warning d-block mt-2">
            Edit Books
          </Link>
        </div>

        <div className="card" style={cardStyle}>
          <img src="./images//delete.jpeg" alt="Delete Book" style={{ width: '200px', margin: 'auto' }} />
          <Link to="/delete" className="btn btn-danger d-block mt-2">
            Delete Book
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" className="navbar-brand" style={titleStyle}>Library Management system</Link>
        <div className="ml-auto">
          <Link to="/" className="btn btn-secondary mr-3">Home</Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/display" element={<DisplayBooks />} />
          <Route path="/edit" element={<EditBooks />} />
          <Route path="/delete" element={<DeleteBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
