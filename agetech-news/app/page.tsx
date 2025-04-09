'use client';

import { useEffect, useState } from 'react';
import { FeedItem } from '../types/feed';
import FeedCard from '../components/FeedCard';
import styles from './page.module.css';
import Masonry from 'react-masonry-css';
import React from 'react';

const breakpointColumnsObj = {
  default: 3,
  985: 1
};


export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [totalSearchResults, setTotalSearchResults] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(66);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hexCount, setHexCount] = useState(0);

  const feedUrl = '/api/feed';

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

          setTotalSearchResults(sorted.length);
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
    const matchQuery = (item: FeedItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return cat === 'Startups'
      ? items.some(item =>
          (normalize(item.category) === 'startups' || normalize(item.category) === 'techstars') &&
          matchQuery(item)
        )
      : items.some(item =>
          normalize(item.category) === target && matchQuery(item)
        );
  });

  const filteredItems = (selectedCategory === 'All'
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
          const newVisibleCount = visibleCount + 66;
          const newHexCount = Math.max(0, Math.ceil(newVisibleCount / 24));
          setHexCount(newHexCount);
          setVisibleCount(newVisibleCount);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
  
      const blueHex = document.querySelectorAll(`.${styles.hexBlue}`);
      const redHex = document.querySelectorAll(`.${styles.hexRed}`);
  
      blueHex.forEach((el) => {
        (el as HTMLElement).style.transform = `translateY(${-scrollY * 0.14}px)`;
      });
  
      redHex.forEach((el) => {
        (el as HTMLElement).style.transform = `translateY(${-scrollY * 0.2}px)`;
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hexPerStories = 24;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const count = Math.max(0, Math.ceil(visibleItems.length / hexPerStories));
      setHexCount(count);
    }, 100); // allow DOM to update first

    return () => clearTimeout(timeout);
  }, [visibleItems]);

  const hexSpacing = 3000;

  const floatingHexes = Array.from({ length: hexCount }).map((_, i) => {
    const offset = i * hexSpacing;
    return (
      <div key={i} className={styles.hexWrapper} style={{ top: `${offset}px` }}>
        <div className={styles.hexBlueWrapper}>
          <img
            src="/Logos-hexagon-right-big.png"
            alt="Blue Hex"
            className={styles.hexBlue}
          />
        </div>
        <div className={styles.hexRedWrapper}>
          <img
            src="/Logos-hexagon-left-big.png"
            alt="Red Hex"
            className={styles.hexRed}
          />
        </div>
      </div>
    );
  });

  useEffect(() => {
    const matchQuery = (item: FeedItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const totalMatches = items.filter(matchQuery).length;
    setTotalSearchResults(totalMatches);
  }, [searchQuery, items]);

  return (
    <>
      {floatingHexes}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>AgeTech News</h1>
            <p className={styles.heroSubheader}>
              The latest news from companies in the Collaborative.
            </p>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.toolbarRow}>
            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterBtn} ${
                  selectedCategory === "All" ? styles.primary : styles.outline
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                {searchQuery ? `All (${totalSearchResults})` : "All"}
              </button>
              {allCategories.map((cat, index) => {
                const count = getSearchMatchCount(cat);
                const label = searchQuery ? `${cat} (${count})` : cat;
                return (
                  <button
                    key={index}
                    className={`${styles.filterBtn} ${
                      selectedCategory === cat ? styles.primary : styles.outline
                    }`}
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
                className={styles.searchInput}
                placeholder="Search Stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* {visibleItems.length > 1 && (
            <div className={styles.featuredRow}>
              <FeedCard
                item={visibleItems[0]}
                showCategory={selectedCategory === "All"}
              />
              <FeedCard
                item={visibleItems[1]}
                showCategory={selectedCategory === "All"}
              />
            </div>
          )} */}

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.masonryGrid}
            columnClassName={styles.masonryColumn}
          >
            {visibleItems.map((item, index) => (
              <div key={index} className={styles.cardWrapper}>
                <FeedCard
                  item={item}
                  showCategory={selectedCategory === "All"}
                />
              </div>
            ))}
          </Masonry>

          {isLoadingMore && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
