import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanSection from './components/PlanSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="cylixlab-app">
      <Navbar />
      <main>
        <Hero />
        <PlanSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
