# Library Management System

The Library Management System is a web application that allows users to manage books in a library. It provides features for adding, viewing editing, and deleting books by searching for books by title or ISBN ,this web application  demostrate the CRUD using React, Express and Mongodb . This README provides information on how to set up and use the system.



## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)



## Features



- Add new books with information such as title, author, ISBN, publication year, and genre.
- user can select genere and publication year from dropdown
- ISBN value is Uniqu, once user gave ISBN number user cannot able to edit the ISBN instead user can delete the ISBN data
- Edit book details  by title or ISBN.
- Delete books from the library  by title or ISBN.
- View a list of all books in the library.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB database setup and running.
- A web browser for accessing the application.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/library-management-system.git

   npm install --  ## Node Modules for both forntend server 

This git project consists of two Folders

1. Frontend
   run Frontend code using npm start
2. library-server
    run library server using node server.js
    Book details wil be stored in Mongodb Database
    using API endpoints it will fetch the data from Mongodb


   
