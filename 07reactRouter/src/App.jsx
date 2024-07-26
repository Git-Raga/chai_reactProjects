import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProductPage from './components/ProductPage';
import ContactPage from './components/ContactPage';
import PageNotFound from './components/PageNotFound';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
