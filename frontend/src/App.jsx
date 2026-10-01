import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanSection from './components/PlanSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import './App.css';

const Home = () => (
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/todo" element={<StudentDashboard initialView="todo" />} />
    </Routes>
  );
}

export default App;
