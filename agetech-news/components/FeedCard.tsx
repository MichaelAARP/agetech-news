import { FeedItem } from '../types/feed';
import styles from '../app/page.module.css';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

type Props = {
  item: FeedItem;
  showCategory: boolean;
  className?: string;
};

export default function FeedCard({ item, showCategory, className = '' }: Props) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-decoration-none ${styles.cardLink}`}
    >
      <div className={`${styles.card} ${className}`}>
      {showCategory && (
        <p className={styles.category}>
          {item.category.endsWith('s') ? item.category.slice(0, -1) : item.category}
        </p>
      )}
        <h2 className={styles.title}>{item.title}</h2>
        
        <p className={styles.date}>{formatDate(item.pubDate)}</p>
        <p className={styles.content}>{item.content}</p>
        <span className={styles.link}>Read more →</span>
      </div>
    </a>
  );
}
