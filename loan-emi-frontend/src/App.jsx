// In src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar'; // Import it here!

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        
        <Navbar />

        {/* Add pt-16 here to clear the fixed navbar! */}
        <main className="pt-16">
          <AppRoutes />
        </main>
        
      </div>
    </Router>
  );
}

export default App;