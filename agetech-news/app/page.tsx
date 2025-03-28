'use client';

import { useEffect, useState } from 'react';
import { FeedItem } from '../types/feed';
import FeedCard from '../components/FeedCard';
import styles from './page.module.css';

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Recent');

  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/100';

  useEffect(() => {
    fetch(`/api/feed?url=${encodeURIComponent(feedUrl)}`)
      .then(async (res) => {
        try {
          return await res.json();
        } catch (err) {
          console.error('Failed to parse JSON response:', err);
          return { error: 'Invalid JSON returned from API' };
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => {
            const dateA = new Date(a.pubDate || '').getTime();
            const dateB = new Date(b.pubDate || '').getTime();
            return dateB - dateA;
          });

          setItems(sorted);
        } else {
          console.error('Feed fetch error:', data.error || 'Unknown error');
        }
      });
  }, []);

  const allCategories = Array.from(new Set(items.map(item => item.category))).filter(cat => cat !== 'Techstars');
  const filteredItems = selectedCategory === 'Recent'
    ? items
    : selectedCategory === 'Startups'
      ? items.filter(item => item.category === 'Startups' || item.category === 'Techstars')
      : items.filter(item => item.category === selectedCategory);

  return (
    <main>
      <div className={styles.hero}>
        <img src="/hero.jpg" alt="Hero" className={styles.heroImage} />
        <h1 className={styles.heroTitle}>AgeTech News</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.filterRow}>
          <button
            className={`btn ${selectedCategory === 'Recent' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory('Recent')}
          >
            Recent
          </button>
          {allCategories.map((cat, index) => (
            <button
              key={index}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredItems.map((item, index) => (
          <FeedCard key={index} item={item} />
        ))}
      </div>
    </main>
  );
}
