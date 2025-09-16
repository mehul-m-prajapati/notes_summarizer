"use client";
import { useState } from "react";
import Markdown from 'react-markdown'
import toast from "react-hot-toast";

export default function Home() {

  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {

    try {
        setLoading(true);
        //toast('Creating Summary ...')

        const resp = await fetch('/api/summarize', {
            method: "POST",
            body: JSON.stringify({text: input}),
            headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json();
        setSummary(data.summary.split("**Summary:**")[1]);
        toast.success('Done')
    }
    catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
    }
    finally {
        setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);

    toast.success('Copied to clipboard');
  }

  function downloadSummary() {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();

    toast.success('Summary downloaded');
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">AI Notes Summarizer</h1>

        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your notes here..."
            rows={10}
            className="w-full border p-2 rounded"
        />

        <button
            onClick={handleSummarize}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
        >
            {loading ? "Summarizing ..." : "Go"}
        </button>

        {summary && (
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Summary:</h2>
                <pre className="whitespace-pre-wrap bg-gray-200 text-black p-4 rounded">
                    <Markdown>{summary}</Markdown>
                </pre>
            </div>
        )}

        <div className="flex gap-4 mt-4">
            <button onClick={() => copyToClipboard(summary)} className="bg-gray-700 cursor-pointer px-3 py-1 rounded">
                📋 Copy
            </button>

            <button onClick={downloadSummary} className="bg-gray-700 cursor-pointer px-3 py-1 rounded">
                ⬇️ Download
            </button>
        </div>
    </main>
  );
}
