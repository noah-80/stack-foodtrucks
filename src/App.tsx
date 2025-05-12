import React from 'react'
import GridPage from './components/GridPage'
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import BarChartRace from './components/BarChartRace'; // Adjust the path as needed
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