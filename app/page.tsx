'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok && data.output) {
        setResult(data.output);
      } else {
        setError(data.error || 'Failed to generate content.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="max-w-3xl w-full bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">AI Prompt Generator</h1>
        <p className="text-gray-600 text-center mt-2">
          Enter your creative prompt below to generate AI-powered content.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          rows={5}
          className="mt-6 w-full p-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        ></textarea>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 rounded-md text-white font-semibold ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 border rounded-md">
            <h2 className="text-lg font-semibold text-gray-700">Result:</h2>
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-gray-500 text-center">
        Made with ❤️ using Next.js, Tailwind CSS, and the Gemini API.
      </footer>
    </div>
  );
}
