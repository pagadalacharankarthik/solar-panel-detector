import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

// IMPORTANT: In production this should be env var
const API_URL = 'http://localhost:8000';

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Added fake delay for "premium feel" (loading animation time)
        await new Promise(r => setTimeout(r, 1500));

        const response = await axios.get(`${API_URL}/infer?lat=${lat}&lon=${lon}&buffer_sqft=1200`);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze location. Backend might be unreachable.");
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchData();
    }
  }, [lat, lon]);

  const handleDownloadCSV = () => {
    if (!data) return;
    const headers = ["sample_id", "latitude", "longitude", "solar_present", "solar_area_m2", "confidence"];
    const row = [data.sample_id, data.latitude, data.longitude, data.solar_present, data.solar_area_m2, data.confidence];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prediction_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prediction_results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-semibold text-white animate-pulse">Analyzing Satellite Data...</h2>
        <p className="text-slate-400 mt-2">Running Mask R-CNN Segmentation</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-red-400 text-xl font-bold mb-2">Analysis Failed</h2>
          <p className="text-gray-300">{error}</p>
          <Link to="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline">Try Another Location</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">← New Search</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-sm font-uppercase tracking-wider text-gray-400 mb-1">Solar Detection Status</h3>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${data.solar_present ? 'text-emerald-400' : 'text-slate-400'}`}>
                {data.solar_present ? "DETECTED" : "NOT DETECTED"}
              </span>
              {data.solar_present && (
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-mono">
                  {Math.round(data.confidence * 100)}% Confidence
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xs text-gray-400 mb-2">Estimated PV Area</h3>
              <p className="text-2xl font-mono text-white">
                {data.solar_area_m2} <span className="text-sm text-gray-500">m²</span>
              </p>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xs text-gray-400 mb-2">QC Status</h3>
              <p className="text-lg font-medium text-white">{data.qc_status}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-medium text-white mb-4">Actions</h3>
            <div className="flex gap-3">
              <button onClick={handleDownloadCSV} className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors">
                Download CSV
              </button>
              <button onClick={handleDownloadJSON} className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors">
                Download JSON
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg text-xs font-mono text-gray-400 break-all">
            ID: {data.sample_id}<br />
            Time: {data.timestamp}
          </div>
        </div>

        {/* Right Col: Images */}
        <div className="space-y-6">
          <div className="glass-panel p-1 rounded-xl overflow-hidden">
            <div className="bg-black/50 p-2 text-center text-xs text-gray-400">Model Prediction Overlay</div>
            {/* Use absolute URL for static files if on different port, else relative works if proxied. 
                  Since we are simple cross-port, we need full URL */}
            <img
              src={`${API_URL}${data.artifact_paths.overlay}`}
              alt="Overlay"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="glass-panel p-1 rounded-xl overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
            <div className="bg-black/50 p-2 text-center text-xs text-gray-400">Original Satellite Image</div>
            <img
              src={`${API_URL}${data.artifact_paths.original}`}
              alt="Original"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
