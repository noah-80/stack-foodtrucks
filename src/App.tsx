import React from 'react'
import GridPage from './components/GridPage'
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import './BarIndex.css';

function App() {
  return (
    <div className="app">
      <Header />
      <GridPage />
      <Footer />
    </div>
  )
}

export default App