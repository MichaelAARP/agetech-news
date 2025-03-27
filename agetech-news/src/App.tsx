import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get("/.netlify/functions/rss-proxy");
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, "application/xml");

        const items = Array.from(xml.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent || "No title",
          link: item.querySelector("link")?.textContent || "#",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          contentSnippet: item.querySelector("description")?.textContent || "",
        }));

        setItems(items);
      } catch (err: any) {
        setError("Failed to fetch RSS feed.");
        console.error("Error fetching RSS:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">AgeTech News</h1>
        <p className="subtitle">Latest updates from the AgeTech Collaborative</p>
      </header>

      <main className="main">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="news-list">
            {items.map((item, index) => (
              <article key={index} className="news-item">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <h2 className="news-title">{item.title}</h2>
                </a>
                <p className="news-date">
                  {new Date(item.pubDate).toLocaleDateString()}
                </p>
                <p className="news-snippet">{item.contentSnippet}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} AgeTech Collaborative. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
