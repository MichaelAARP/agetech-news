'use client';

import { useEffect, useState } from 'react';
import { FeedItem } from '../types/feed';
import FeedCard from '../components/FeedCard';
import styles from './page.module.css';

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Recent');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(150);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const feedUrl = '/feed.json';

  useEffect(() => {
    fetch(feedUrl)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const cleaned = data.map(item => ({
            ...item,
            title: item.title?.replace(/\s*\([^()]+\)\s*$/, '') ?? '',
          }));
  
          const sorted = cleaned.sort((a, b) => {
            const dateA = new Date(a.pubDate || '').getTime();
            const dateB = new Date(b.pubDate || '').getTime();
            return dateB - dateA;
          });
  
          setItems(sorted);
        } else {
          console.error('Feed fetch error:', data.error || 'Unknown error');
        }
      })
      .catch(err => {
        console.error('Fetch failed:', err);
      });
  }, []);

  const customOrder = ['Startups', 'Investors', 'Enterprises', 'Testbeds', 'Business Services'];
  const allCategories = customOrder.filter(cat => {
    const normalize = (str: string) => str?.toLowerCase().trim();
    const target = normalize(cat);

    return cat === 'Startups'
      ? items.some(item =>
          normalize(item.category) === 'startups' || normalize(item.category) === 'techstars'
        )
      : items.some(item => normalize(item.category) === target);
  });

  const filteredItems = (selectedCategory === 'Recent'
    ? items
    : selectedCategory === 'Startups'
      ? items.filter(item => item.category === 'Startups' || item.category === 'Techstars')
      : items.filter(item => item.category === selectedCategory)
  ).filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleItems = searchQuery ? filteredItems : filteredItems.slice(0, visibleCount);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottomReached && !isLoadingMore && !searchQuery && visibleCount < filteredItems.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 150);
          setIsLoadingMore(false);
        }, 250);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, visibleCount, searchQuery, filteredItems.length]);

  const getSearchMatchCount = (category: string) => {
    const normalize = (str: string) => str?.toLowerCase().trim();
    const matchQuery = (item: FeedItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return category === 'Startups'
      ? items.filter(item =>
          (normalize(item.category) === 'startups' || normalize(item.category) === 'techstars') &&
          matchQuery(item)
        ).length
      : items.filter(item =>
          normalize(item.category) === normalize(category) && matchQuery(item)
        ).length;
  };

  return (
    <main style={{ backgroundColor: '#f9f8f6' }}>
      <div className={styles.hero}>
        <img src="/hero.jpg" alt="AgeTech News" className={styles.heroImage} />
        <h1 className={styles.heroTitle}>AgeTech News</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbarRow}>
          <div className={styles.filterGroup}>
            <button
              className={`btn ${selectedCategory === 'Recent' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory('Recent')}
            >
              Recent
            </button>
            {allCategories.map((cat, index) => {
              const count = getSearchMatchCount(cat);
              const label = searchQuery ? `${cat} (${count})` : cat;
              return (
                <button
                  key={index}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className={styles.searchGroup}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {visibleItems.map((item, index) => (
          <FeedCard key={index} item={item} showCategory={selectedCategory === 'Recent'} />
        ))}

        {isLoadingMore && (
          <div className={styles.loadingIndicator}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
