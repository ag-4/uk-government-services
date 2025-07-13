// Database API routes for user data storage
// Provides endpoints for bookmarks, newsletter subscriptions, and sent messages

import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ACTIONS_FILE = path.join(DATA_DIR, 'user-actions.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.warn('Failed to create data directory:', error);
  }
};

// Helper functions for file operations
const readJsonFile = async (filePath: string, defaultValue: any[] = []) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
};

const writeJsonFile = async (filePath: string, data: any) => {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Bookmarks endpoints
router.get('/bookmarks', async (req, res) => {
  try {
    const { userId } = req.query;
    let bookmarks = await readJsonFile(BOOKMARKS_FILE);
    
    if (userId) {
      bookmarks = bookmarks.filter((b: any) => b.userId === userId);
    }
    
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/bookmarks', async (req, res) => {
  try {
    const bookmarkData = req.body;
    const bookmarks = await readJsonFile(BOOKMARKS_FILE);
    
    const newBookmark = {
      ...bookmarkData,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    bookmarks.push(newBookmark);
    await writeJsonFile(BOOKMARKS_FILE, bookmarks);
    
    res.json({ success: true, data: newBookmark });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.delete('/bookmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookmarks = await readJsonFile(BOOKMARKS_FILE);
    
    const filteredBookmarks = bookmarks.filter((b: any) => b.id !== id);
    await writeJsonFile(BOOKMARKS_FILE, filteredBookmarks);
    
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Newsletter subscriptions endpoints
router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/subscriptions', async (req, res) => {
  try {
    const subscriptionData = req.body;
    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    
    // Check if email already exists
    const existingSubscription = subscriptions.find((s: any) => s.email === subscriptionData.email);
    if (existingSubscription) {
      return res.status(400).json({ success: false, error: 'Email already subscribed' });
    }
    
    const newSubscription = {
      ...subscriptionData,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    subscriptions.push(newSubscription);
    await writeJsonFile(SUBSCRIPTIONS_FILE, subscriptions);
    
    res.json({ success: true, data: newSubscription });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    
    const subscriptionIndex = subscriptions.findIndex((s: any) => s.id === id);
    if (subscriptionIndex === -1) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    
    subscriptions[subscriptionIndex] = { ...subscriptions[subscriptionIndex], ...updates };
    await writeJsonFile(SUBSCRIPTIONS_FILE, subscriptions);
    
    res.json({ success: true, data: subscriptions[subscriptionIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Sent messages endpoints
router.get('/messages', async (req, res) => {
  try {
    const messages = await readJsonFile(MESSAGES_FILE);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const messageData = req.body;
    const messages = await readJsonFile(MESSAGES_FILE);
    
    const newMessage = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    
    messages.push(newMessage);
    await writeJsonFile(MESSAGES_FILE, messages);
    
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// User actions tracking
router.post('/track', async (req, res) => {
  try {
    const actionData = req.body;
    const actions = await readJsonFile(ACTIONS_FILE);
    
    const newAction = {
      ...actionData,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    // Keep only last 1000 actions to prevent file from growing too large
    actions.push(newAction);
    if (actions.length > 1000) {
      actions.splice(0, actions.length - 1000);
    }
    
    await writeJsonFile(ACTIONS_FILE, actions);
    
    res.json({ success: true, data: newAction });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    await ensureDataDir();
    
    // Test file operations
    const testFile = path.join(DATA_DIR, 'health-test.json');
    await writeJsonFile(testFile, { test: true });
    const testData = await readJsonFile(testFile);
    await fs.unlink(testFile);
    
    res.json({
      success: true,
      status: 'healthy',
      details: {
        database: 'file-based',
        dataDirectory: DATA_DIR,
        writeTest: testData.test === true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;