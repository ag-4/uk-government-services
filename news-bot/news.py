import sys
import os
import signal
import logging
from datetime import datetime
import threading
import time
import schedule
from advanced_bot import AdvancedNewsBot

# Override system time for testing
os.environ['TESTING_TIME'] = '2024-07-10 12:00:00'

# Setup logging with UTF-8 encoding and correct timestamps
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.FileHandler('news_bot.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

# Override datetime in logging to use local time
logging.Formatter.converter = time.localtime

# Custom logging formatter for testing
class TestingTimeFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        testing_time = os.environ.get('TESTING_TIME')
        if testing_time:
            dt = datetime.strptime(testing_time, '%Y-%m-%d %H:%M:%S')
            return dt.strftime(datefmt) if datefmt else dt.strftime('%Y-%m-%d %H:%M:%S')
        return super().formatTime(record, datefmt)

# Apply custom formatter to all handlers
formatter = TestingTimeFormatter('%(asctime)s - %(levelname)s - %(message)s')
for handler in logging.root.handlers:
    handler.setFormatter(formatter)

class ContinuousNewsService:
    def __init__(self):
        self.bot = AdvancedNewsBot()
        self.running = False
        self.scheduler_thread = None
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
    def signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        logging.info(f"Received signal {signum}. Shutting down bot...")
        self.stop_service()
        sys.exit(0)
        
    def start_service(self):
        """Start the continuous service"""
        logging.info("Starting News Bot Service...")
        
        self.running = True
        
        # Setup scheduling
        self.setup_schedule()
        
        # Run initial collection
        self.initial_collection()
        
        # Start scheduler thread
        self.scheduler_thread = threading.Thread(target=self.run_scheduler)
        self.scheduler_thread.daemon = True
        self.scheduler_thread.start()
        
        # Keep the program running
        try:
            while self.running:
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logging.info("Bot stopped by user")
        finally:
            self.stop_service()
            
    def setup_schedule(self):
        """Setup task scheduling"""
        # Collect news every 2 hours
        schedule.every(2).hours.do(self.scheduled_collection)
        
        # Daily summary at 9 AM
        schedule.every().day.at("09:00").do(self.daily_summary)
        
        # Health check every 6 hours
        schedule.every(6).hours.do(self.health_check)
        
        # Weekly cleanup on Monday at 2 AM
        schedule.every().monday.at("02:00").do(self.weekly_cleanup)
        
        logging.info("Scheduling setup complete:")
        logging.info("- News collection: Every 2 hours")
        logging.info("- Daily summary: 9:00 AM")
        logging.info("- Health check: Every 6 hours")
        logging.info("- Weekly cleanup: Monday 2:00 AM")
        
    def run_scheduler(self):
        """Run scheduler in separate thread"""
        while self.running:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except Exception as e:
                logging.error(f"Scheduler error: {e}")
                time.sleep(300)  # Wait 5 minutes on error
                
    def initial_collection(self):
        """Initial news collection on startup"""
        logging.info("Starting initial news collection...")
        try:
            articles = self.bot.run_once()
            if articles:
                logging.info(f"Collected {len(articles)} articles in initial run")
            else:
                logging.warning("No articles collected in initial run")
        except Exception as e:
            logging.error(f"Error in initial collection: {e}")
            
    def scheduled_collection(self):
        """Scheduled news collection"""
        logging.info("Starting scheduled news collection...")
        try:
            articles = self.bot.run_once()
            if articles:
                logging.info(f"Collected {len(articles)} articles in scheduled run")
            else:
                logging.info("No new articles found")
        except Exception as e:
            logging.error(f"Error in scheduled collection: {e}")
            
    def daily_summary(self):
        """Generate daily summary"""
        logging.info("Generating daily summary...")
        try:
            self.bot.generate_daily_summary()
            logging.info("Daily summary generated successfully")
        except Exception as e:
            logging.error(f"Error generating daily summary: {e}")
            
    def health_check(self):
        """System health check"""
        logging.info("Performing system health check...")
        try:
            # Check database
            articles = self.bot.get_recent_articles(24)
            logging.info(f"Articles in last 24 hours: {len(articles)}")
            
            # Check disk space
            import os
            import shutil
            
            total, used, free = shutil.disk_usage(".")
            free_gb = free // (1024**3)
            logging.info(f"Available disk space: {free_gb} GB")
            
            if free_gb < 1:
                logging.warning("Warning: Less than 1 GB disk space available")
                
        except Exception as e:
            logging.error(f"Error in health check: {e}")
            
    def weekly_cleanup(self):
        """Weekly database cleanup"""
        logging.info("Starting weekly cleanup...")
        try:
            import sqlite3
            conn = sqlite3.connect(self.bot.db_path)
            cursor = conn.cursor()
            
            # Delete articles older than 30 days
            cursor.execute('''
                DELETE FROM articles 
                WHERE created_at < datetime('now', '-30 days')
            ''')
            
            deleted_count = cursor.rowcount
            
            # Optimize database
            cursor.execute('VACUUM')
            
            conn.commit()
            conn.close()
            
            logging.info(f"Deleted {deleted_count} old articles and optimized database")
            
        except Exception as e:
            logging.error(f"Error in weekly cleanup: {e}")
            
    def stop_service(self):
        """Stop the service"""
        logging.info("Stopping bot service...")
        self.running = False
        schedule.clear()
        logging.info("Bot stopped successfully")
        
    def get_status(self):
        """Get bot status"""
        if self.running:
            current_time = datetime.now()
            next_run = schedule.next_run()
            if next_run:
                next_run = next_run.strftime('%Y-%m-%d %H:%M:%S')
            return {
                'status': 'running',
                'uptime': current_time.strftime('%Y-%m-%d %H:%M:%S'),
                'next_collection': next_run,
                'jobs': len(schedule.jobs)
            }
        else:
            return {'status': 'stopped'}

# Class for managing bot as Windows/Linux service
class ServiceManager:
    @staticmethod
    def install_windows_service():
        """Install bot as Windows service"""
        service_script = '''import win32serviceutil
import win32service
import win32event
import servicemanager
import sys
import os

# Add project path
sys.path.append(r'C:\path\to\your\project')  # Change this path

from continuous_service import ContinuousNewsService

class NewsBotService(win32serviceutil.ServiceFramework):
    _svc_name_ = "NewsBot"
    _svc_display_name_ = "AI News Summarizer Bot"
    _svc_description_ = "AI-powered news summarization service"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        self.service = ContinuousNewsService()

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        self.service.stop_service()

    def SvcDoRun(self):
        servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                            servicemanager.PYS_SERVICE_STARTED,
                            (self._svc_name_, ''))
        self.service.start_service()

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(NewsBotService)
'''
        with open('news_bot_service.py', 'w', encoding='utf-8') as f:
            f.write(service_script)
        
        print("Service file created. To install the service:")
        print("python news_bot_service.py install")
        print("python news_bot_service.py start")
        
    @staticmethod
    def create_systemd_service():
        """Create systemd service for Linux"""
        service_content = '''[Unit]
Description=AI News Summarizer Bot
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/python3 /path/to/your/project/continuous_service.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
'''
        with open('news-bot.service', 'w') as f:
            f.write(service_content)
        
        print("Service file created. To install the service:")
        print("sudo cp news-bot.service /etc/systemd/system/")
        print("sudo systemctl daemon-reload")
        print("sudo systemctl enable news-bot.service")
        print("sudo systemctl start news-bot.service")

def main():
    """Main function"""
    service = ContinuousNewsService()
    
    print("AI News Summarizer Bot")
    print("=" * 50)
    print("1. Start continuous service")
    print("2. Run once (for testing)")
    print("3. Create Windows service")
    print("4. Create Linux service")
    print("5. Show bot status")
    
    choice = input("\nSelect option (1-5): ").strip()
    
    if choice == '1':
        print("\nStarting continuous service...")
        print("Use Ctrl+C to stop the bot")
        service.start_service()
        
    elif choice == '2':
        print("\nRunning once...")
        service.initial_collection()
        
    elif choice == '3':
        print("\nCreating Windows service...")
        ServiceManager.install_windows_service()
        
    elif choice == '4':
        print("\nCreating Linux service...")
        ServiceManager.create_systemd_service()
        
    elif choice == '5':
        print("\nBot status:")
        status = service.get_status()
        for key, value in status.items():
            print(f"   {key}: {value}")
            
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()