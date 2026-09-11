'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 flex flex-col justify-between text-gray-800">
      
      {/* HEADER / LOGO */}
      <header className="w-full py-6 px-6 sm:px-12 border-b border-gray-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
              W
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              WolofLex <span className="text-indigo-600 text-sm font-normal px-2 py-0.5 bg-indigo-50 rounded-full ml-1">Beta</span>
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 hidden sm:inline-block">
            Projet Open Source • FR ⇄ WO
          </span>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Dictionnaire <span className="text-indigo-600">Français-Wolof</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Explorez instantanément les expressions, les définitions et les nuances de la langue wolof.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 shadow-lg shadow-gray-200/50 p-2 bg-white rounded-2xl border border-gray-200">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un mot, une phrase (ex: omar, riz)..."
              className="w-full pl-11 pr-4 py-3.5 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recherche...
              </>
            ) : (
              'Rechercher'
            )}
          </button>
        </form>

        {/* Section des Résultats */}
        <div className="mt-10 space-y-4">
          {searched && !loading && results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">Aucun résultat trouvé pour &laquo; <span className="font-semibold text-gray-800">{query}</span> &raquo;.</p>
              <p className="text-sm text-gray-400 mt-1">Essayez avec un autre terme ou un mot plus court.</p>
            </div>
          )}

          {results.map((item : any, index : number) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                  Source
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                {item.input}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Traduction / Définition
                </span>
                <div className="text-gray-700 text-base leading-relaxed">
                  {typeof item.output === 'object' 
                    ? JSON.stringify(item.output, null, 2) 
                    : item.output}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-6 px-6 text-center border-t border-gray-200/60 bg-white/40 mt-12">
        <p className="text-sm text-gray-500">
          Développé avec <span className="text-red-500">❤️</span> pour valoriser la langue wolof. &copy; 2026 Souleymane Thiao. 

        </p>
        
      </footer>

    </div>
  );
}
