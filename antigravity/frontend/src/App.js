import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';

import BatchPage from './pages/BatchPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-antigravity-dark text-white flex flex-col">
                <header className="p-6 border-b border-white/10 glass-panel sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-wider">
                            SOLAR DETECTOR
                        </h1>
                        <nav className="space-x-4 text-sm text-gray-400">
                            <span>EcoInnovators 2026</span>
                        </nav>
                    </div>
                </header>
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<InputPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                        <Route path="/batch" element={<BatchPage />} />
                    </Routes>
                </main>
                <footer className="p-6 text-center text-gray-500 text-xs border-t border-white/10">
                    &copy; 2026 Solar Detection System. All rights reserved.
                </footer>
            </div>
        </Router>
    );
}

export default App;
