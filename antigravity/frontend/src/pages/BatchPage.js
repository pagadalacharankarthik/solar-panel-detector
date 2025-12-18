import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:8000';

function BatchPage() {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setResults(null);
    };

    const parseCSV = (text) => {
        const lines = text.split('\n');
        const locations = [];
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const latIdx = headers.findIndex(h => h.includes('lat'));
        const lonIdx = headers.findIndex(h => h.includes('lon'));
        const idIdx = headers.findIndex(h => h.includes('id'));

        if (latIdx === -1 || lonIdx === -1) {
            throw new Error("CSV must contain 'lat' and 'lon' columns");
        }

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = lines[i].split(',').map(c => c.trim());
            if (cols.length < 2) continue;

            locations.push({
                id: idIdx !== -1 ? cols[idIdx] : `loc_${i}`,
                lat: parseFloat(cols[latIdx]),
                lon: parseFloat(cols[lonIdx])
            });
        }
        return locations;
    };

    const parseExcel = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                    const locations = jsonData.map((row, index) => {
                        const latKey = Object.keys(row).find(k => k.toLowerCase().includes('lat'));
                        const lonKey = Object.keys(row).find(k => k.toLowerCase().includes('lon'));
                        const idKey = Object.keys(row).find(k => k.toLowerCase().includes('id'));

                        if (!latKey || !lonKey) {
                            throw new Error("Excel must contain 'lat' and 'lon' columns");
                        }

                        return {
                            id: idKey ? String(row[idKey]) : `loc_${index + 1}`,
                            lat: parseFloat(row[latKey]),
                            lon: parseFloat(row[lonKey])
                        };
                    });
                    resolve(locations);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file first.");
            return;
        }

        try {
            setProcessing(true);
            setProgress(10);

            let locations = [];
            if (file.name.endsWith('.csv')) {
                const text = await file.text();
                locations = parseCSV(text);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                locations = await parseExcel(file);
            } else {
                throw new Error("Unsupported file format. Use CSV or Excel.");
            }

            console.log("Parsed locations:", locations);

            if (locations.length === 0) {
                throw new Error("No valid locations found in CSV");
            }

            if (locations.length > 50) {
                if (!window.confirm(`You are about to process ${locations.length} locations. This might take a while. Continue?`)) {
                    setProcessing(false);
                    return;
                }
            }

            setProgress(30);

            // Batch API call
            const response = await axios.post(`${API_URL}/batch_infer`, {
                locations: locations
            });

            setProgress(100);
            setResults(response.data.results);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to process batch.");
        } finally {
            setProcessing(false);
        }
    };

    const downloadResults = () => {
        if (!results) return;

        // Exporting as JSON matching the sample format
        const output = results.map(r => ({
            sample_id: r.sample_id,
            latitude: r.latitude,
            longitude: r.longitude,
            solar_present: r.solar_present,
            solar_area_m2: r.solar_area_m2,
            confidence: r.confidence,
            qc_status: r.qc_status,
            is_mock_data: r.is_mock_data || false,
            buffer_size_sqft: r.buffer_size_sqft || 1200,
            model_version: r.model_version || "v1.0",
            timestamp: r.timestamp || new Date().toISOString(),
            artifact_paths: r.artifact_paths
        }));

        const jsonString = JSON.stringify(output, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "batch_results.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Batch Processor</h2>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to Map</Link>
            </div>

            <div className="glass-panel p-8 rounded-xl max-w-2xl mx-auto text-center">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-10 hover:border-blue-500/50 transition-colors">
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="batchInput"
                    />
                    <label htmlFor="batchInput" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📄</span>
                        </div>
                        <span className="text-lg font-medium text-white mb-2">
                            {file ? file.name : "Drop CSV/Excel file here or Click to Upload"}
                        </span>
                        <span className="text-xs text-slate-400">
                            Format: id, lat, lon (CSV or XLSX)
                        </span>
                    </label>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || processing}
                    className={`mt-6 w-full py-6 text-xl uppercase tracking-wider rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl
                ${!file || processing ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/50'}
            `}
                >
                    <span className="flex items-center justify-center gap-3">
                        {processing ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">🚀</span>
                                <span>Run Batch Analysis</span>
                            </>
                        )}
                    </span>
                </button>

                {processing && (
                    <div className="w-full bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {results && (
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Results ({results.length})</h3>
                        <button
                            onClick={downloadResults}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Download Report
                        </button>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-slate-800/50 text-xs uppercase font-medium text-gray-300">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Solar Detected</th>
                                    <th className="px-6 py-4">Area (m²)</th>
                                    <th className="px-6 py-4">Confidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {results.map((r, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-white">{r.user_id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${r.solar_present ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"
                                                }`}>
                                                {r.solar_present ? "YES" : "NO"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">{r.solar_area_m2}</td>
                                        <td className="px-6 py-4">
                                            {r.confidence ? Math.round(r.confidence * 100) + "%" : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchPage;
