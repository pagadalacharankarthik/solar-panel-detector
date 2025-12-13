import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function InputPage() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Preview
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('solar_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (latitude, longitude) => {
    const newItem = { lat: latitude, lon: longitude, date: new Date().toISOString() };
    const newHistory = [newItem, ...history.filter(h => h.lat !== latitude || h.lon !== longitude)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('solar_history', JSON.stringify(newHistory));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (lat && lon) setStep(2);
  };

  const handleAnalyze = () => {
    saveToHistory(lat, lon);
    navigate(`/results?lat=${lat}&lon=${lon}`);
  };

  const loadHistoryItem = (item) => {
    setLat(item.lat);
    setLon(item.lon);
    setStep(1); // Go to input to confirm
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Solar Panel Detector
          </h2>
          <p className="text-gray-400">
            Advanced satellite imagery analysis for photovoltaic estimation.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden mb-8">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

          <div className="flex justify-end mb-4">
            <Link to="/batch" className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide border border-blue-400/30 px-3 py-1 rounded-full hover:bg-blue-400/10 transition-colors">
              ✨ Switch to Batch Mode
            </Link>
          </div>

          {step === 1 ? (
            <form onSubmit={handlePreview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 36.1699"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. -115.1398"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Inspect Location
              </button>

              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <button type="button" onClick={() => { setLat(36.1699); setLon(-115.1398) }} className="hover:text-blue-400">Example: Las Vegas</button>
                <button type="button" onClick={() => { setLat(34.0522); setLon(-118.2437) }} className="hover:text-blue-400">Example: Los Angeles</button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">Target Confirmation</h3>
                <p className="text-sm text-gray-400 mt-1 font-mono">{lat}, {lon}</p>
              </div>

              <div className="aspect-video bg-slate-900 rounded-lg border border-slate-700 overflow-hidden relative group">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${lat},${lon}&hl=es;z=20&output=embed`}
                  title="Map Preview"
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                </iframe>
                <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/30 rounded-lg"></div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleAnalyze}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  Run Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent History</h3>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => loadHistoryItem(item)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 rounded-lg transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🕒</span>
                    <span className="text-sm text-gray-300 font-mono text-xs">{item.lat}, {item.lon}</span>
                  </div>
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Load →</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default InputPage;
