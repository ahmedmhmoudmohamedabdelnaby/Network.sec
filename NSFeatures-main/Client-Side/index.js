import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import Register from './components/Register';
import PendingApprovalPage from './components/PendingApprovalPage';
import Users from './components/Users';
import Books from './components/Books';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';
import Home from './components/Home';
import Book from './components/Book';
import UserRequests from './components/UserRequests';
import AdminRequests from './components/AdminRequests';
import UserArchive from './components/UserArchive';
import NotFound from './components/NotFound';
import Authorization from './components/Authorization';
import AdminArchive from './components/AdminArchive';
import Approved from './components/Approved';

createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/NotFound" element={<Approved><NotFound /></Approved>} />
            <Route path="/Home" element={<Approved><Home /></Approved>} />
            <Route path="/Home/UserRequests" element={<Approved><UserRequests /></Approved>} />
            <Route path="/Home/Archive" element={<Approved><UserArchive /></Approved>} />
            <Route path="/Home/Book/:BookID" element={<Approved><Book /></Approved>} />

            <Route path="/" element={<App />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Logout" element={<Register />} />
            <Route path="/PendingApproval" element={<PendingApprovalPage />} />

            <Route path="/Books/AddBook" element={<Authorization><AddBook /></Authorization>} />
            <Route path="/Books/UpdateBook/:bookId" element={<Authorization><UpdateBook /></Authorization>} />
            <Route path="/Admin/UserRequests" element={<Authorization><AdminRequests /></Authorization>} />
            <Route path="/Admin/Archive" element={<Authorization><AdminArchive /></Authorization>} />
            <Route path="/Users" element={<Authorization><Users /></Authorization>} />
            <Route path="/Books" element={<Authorization><Books /></Authorization>} />
        </Routes>
    </Router>

);
