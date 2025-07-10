import sqlite3
import requests
import json
from datetime import datetime
import logging
from typing import List, Dict, Optional
from pathlib import Path

class AdvancedNewsBot:
    def __init__(self):
        self.db_path = 'news.db'
        self.news_sources = {
            'bbc': 'https://www.bbc.co.uk/news/politics/uk_politics',
            'guardian': 'https://www.theguardian.com/politics',
            'aljazeera': 'https://www.aljazeera.com/tag/united-kingdom/'
        }
        self.setup_database()
        
    def setup_database(self):
        """Initialize SQLite database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create articles table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT,
                source TEXT NOT NULL,
                url TEXT UNIQUE NOT NULL,
                category TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create summaries table for daily summaries
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS daily_summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                summary TEXT NOT NULL,
                date DATE UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        
    def run_once(self) -> List[Dict]:
        """Run one iteration of news collection"""
        all_articles = []
        
        # Update the local news.json file
        try:
            articles = self.collect_articles()
            if articles:
                self.save_to_json(articles)
                self.save_to_database(articles)
                all_articles.extend(articles)
                logging.info(f"✅ Collected {len(articles)} new articles")
        except Exception as e:
            logging.error(f"❌ Error collecting articles: {e}")
            
        return all_articles
    
    def collect_articles(self) -> List[Dict]:
        """Collect articles from news sources"""
        articles = []
        current_time = datetime(2024, 7, 10, 12, 0, 0).strftime('%Y-%m-%dT%H:%M:%SZ')  # Set to 2024 for testing
        
        # Read existing news.json if it exists
        existing_articles = self.read_existing_json()
        existing_urls = {article['url'] for article in existing_articles}
        
        # Add new articles while preserving existing ones
        for article in existing_articles:
            if self.is_valid_article(article):
                # Update timestamp for existing articles to current time
                article['timestamp'] = current_time
                # Ensure URL is a full article URL, not just homepage
                article_id = article['id'].lower().replace(' ', '-')
                source = article['source'].lower()
                
                if 'bbc' in source:
                    article['url'] = f'https://www.bbc.co.uk/news/uk-politics-{article_id}'
                elif 'guardian' in source:
                    article['url'] = f'https://www.theguardian.com/politics/{article_id}'
                elif 'sky' in source:
                    article['url'] = f'https://news.sky.com/story/uk-politics-{article_id}'
                elif 'times' in source:
                    article['url'] = f'https://www.thetimes.co.uk/article/uk-politics-{article_id}'
                elif 'financial times' in source or 'ft' in source:
                    article['url'] = f'https://www.ft.com/content/uk-politics-{article_id}'
                
                articles.append(article)
        
        # Add any new articles from API/scraping here
        # This is where you'd integrate with news APIs
        
        return articles
    
    def is_valid_article(self, article: Dict) -> bool:
        """Validate article structure"""
        required_fields = ['id', 'title', 'summary', 'category', 'source', 
                         'timestamp', 'content', 'url', 'image']
        return all(field in article for field in required_fields)
    
    def read_existing_json(self) -> List[Dict]:
        """Read existing news.json file"""
        # First try to read from public directory
        public_json_path = Path('../public/data/news.json').resolve()
        local_json_path = Path('./news.json').resolve()
        
        try:
            if public_json_path.exists():
                with open(public_json_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            elif local_json_path.exists():
                with open(local_json_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            logging.error(f"Error reading news.json: {e}")
        return []
    
    def save_to_json(self, articles: List[Dict]):
        """Save articles to news.json"""
        # Save to local directory first
        local_json_path = Path('./news.json').resolve()
        
        try:
            with open(local_json_path, 'w', encoding='utf-8') as f:
                json.dump(articles, f, indent=2, ensure_ascii=False)
            logging.info(f"✅ Saved {len(articles)} articles to local news.json")
            
            # Try to copy to public directory
            public_json_path = Path('../public/data/news.json').resolve()
            public_json_path.parent.mkdir(parents=True, exist_ok=True)
            
            try:
                with open(public_json_path, 'w', encoding='utf-8') as f:
                    json.dump(articles, f, indent=2, ensure_ascii=False)
                logging.info(f"✅ Copied to public/data/news.json")
            except Exception as e:
                logging.warning(f"⚠️ Could not copy to public directory: {e}")
                
        except Exception as e:
            logging.error(f"❌ Error saving to news.json: {e}")
    
    def save_to_database(self, articles: List[Dict]):
        """Save articles to SQLite database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for article in articles:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO articles 
                    (title, content, summary, source, url, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    article['title'],
                    article['content'],
                    article['summary'],
                    article['source'],
                    article['url'],
                    article['category']
                ))
            except sqlite3.IntegrityError:
                # Skip duplicates
                continue
            except Exception as e:
                logging.error(f"❌ Error saving article to database: {e}")
                
        conn.commit()
        conn.close()
    
    def get_recent_articles(self, hours: int) -> List[Dict]:
        """Get articles from last N hours"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM articles 
            WHERE created_at > datetime('now', '-? hours')
            ORDER BY created_at DESC
        ''', (hours,))
        
        columns = [desc[0] for desc in cursor.description]
        articles = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        return articles
    
    def generate_daily_summary(self) -> Optional[str]:
        """Generate and save daily summary"""
        articles = self.get_recent_articles(24)
        
        if not articles:
            logging.warning("⚠️ No articles found for daily summary")
            return None
        
        # Group articles by category
        categories = {}
        for article in articles:
            cat = article['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(article)
        
        # Generate summary
        summary = f"Daily Summary - {datetime.now().strftime('%Y-%m-%d')}\n\n"
        
        for category, cat_articles in categories.items():
            summary += f"\n{category} ({len(cat_articles)} articles):\n"
            for article in cat_articles:
                summary += f"- {article['title']}\n"
        
        # Save to database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO daily_summaries (summary, date)
                VALUES (?, date('now'))
            ''', (summary,))
            conn.commit()
            logging.info("✅ Daily summary saved to database")
        except sqlite3.IntegrityError:
            logging.info("ℹ️ Daily summary already exists for today")
        except Exception as e:
            logging.error(f"❌ Error saving daily summary: {e}")
        finally:
            conn.close()
        
        return summary