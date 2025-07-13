import express from 'express';
import axios from 'axios';
import { cache } from '../server';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface Bill {
  id: string;
  billId: number;
  title: string;
  longTitle: string;
  summary: string;
  description: string;
  status: string;
  stage: string;
  currentHouse: string;
  introducedDate: string;
  lastUpdated: string;
  sponsor: string;
  promoter: string;
  type: string;
  category: string;
  url: string;
  parliamentUrl: string;
  sessions: Array<{
    sessionId: number;
    name: string;
  }>;
  publications: Array<{
    id: number;
    title: string;
    publicationType: string;
    displayDate: string;
    url: string;
  }>;
  stages: Array<{
    id: number;
    description: string;
    house: string;
    stageSittings: Array<{
      id: number;
      date: string;
      provisional: boolean;
    }>;
  }>;
}

// Generate fallback bills data programmatically
function generateFallbackBills(): Bill[] {
  const currentDate = new Date().toISOString();
  return [
    {
      id: 'bill-sample-1',
      billId: 1,
      title: 'Digital Services Improvement Bill',
      longTitle: 'A Bill to improve digital services for citizens',
      summary: 'This bill aims to enhance digital government services and citizen engagement.',
      description: 'A comprehensive bill to modernize government digital infrastructure and improve citizen access to services.',
      status: 'Second Reading - Commons',
      stage: 'Second Reading',
      currentHouse: 'Commons',
      introducedDate: currentDate,
      lastUpdated: currentDate,
      sponsor: 'Cabinet Office',
      promoter: 'Government',
      type: 'Government Bill',
      category: 'Technology',
      url: 'https://bills.parliament.uk/bills/sample',
      parliamentUrl: 'https://bills.parliament.uk/bills/sample',
      sessions: [],
      publications: [],
      stages: []
    },
    {
      id: 'bill-sample-2',
      billId: 2,
      title: 'Citizen Rights Protection Bill',
      longTitle: 'A Bill to strengthen citizen rights and protections',
      summary: 'This bill enhances legal protections for citizen rights and freedoms.',
      description: 'Legislation to strengthen the legal framework protecting citizen rights and civil liberties.',
      status: 'Committee Stage - Commons',
      stage: 'Committee Stage',
      currentHouse: 'Commons',
      introducedDate: currentDate,
      lastUpdated: currentDate,
      sponsor: 'Ministry of Justice',
      promoter: 'Government',
      type: 'Government Bill',
      category: 'Justice',
      url: 'https://bills.parliament.uk/bills/sample2',
      parliamentUrl: 'https://bills.parliament.uk/bills/sample2',
      sessions: [],
      publications: [],
      stages: []
    }
  ];
}

// Fetch bills from Parliament API
async function fetchBillsFromParliamentAPI(): Promise<Bill[]> {
  try {
    const response = await axios.get('https://bills-api.parliament.uk/api/v1/Bills', {
      params: {
        CurrentHouse: 'All',
        OriginatingHouse: 'All',
        MemberId: '',
        DepartmentId: '',
        SearchTerm: '',
        BillStage: 'All',
        BillType: 'All',
        SortOrder: 'DateUpdated',
        CurrentStatus: 'All',
        take: 100,
        skip: 0
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'UK-Gov-Services-App/1.0'
      }
    });

    if (response.data && response.data.items) {
      const bills = await Promise.all(
        response.data.items.slice(0, 50).map(async (bill: any) => {
          try {
            // Fetch detailed bill information
            const detailResponse = await axios.get(`https://bills-api.parliament.uk/api/v1/Bills/${bill.billId}`, {
              timeout: 10000
            });
            
            const detail = detailResponse.data;
            
            return {
              id: `bill-${bill.billId}`,
              billId: bill.billId,
              title: bill.shortTitle || bill.longTitle || 'Untitled Bill',
              longTitle: bill.longTitle || bill.shortTitle || '',
              summary: bill.summary || '',
              description: detail.summary || bill.summary || `${bill.shortTitle} - Parliamentary Bill`,
              status: getCurrentStatus(detail.currentStage),
              stage: detail.currentStage?.description || 'Unknown',
              currentHouse: detail.currentStage?.house || bill.currentHouse || 'Unknown',
              introducedDate: bill.introducedDate || bill.dateIntroduced || '',
              lastUpdated: bill.lastUpdate || new Date().toISOString(),
              sponsor: detail.sponsor?.name || bill.sponsor || 'Unknown',
              promoter: detail.promoters?.[0]?.organisationName || 'Government',
              type: getBillType(bill.billTypeId),
              category: getBillCategory(bill.shortTitle),
              url: `https://bills.parliament.uk/bills/${bill.billId}`,
              parliamentUrl: `https://bills.parliament.uk/bills/${bill.billId}`,
              sessions: detail.sessions || [],
              publications: detail.publications || [],
              stages: detail.stages || []
            };
          } catch (detailError) {
            console.error(`Error fetching bill ${bill.billId} details:`, detailError);
            // Return basic bill info if detailed fetch fails
            return {
              id: `bill-${bill.billId}`,
              billId: bill.billId,
              title: bill.shortTitle || bill.longTitle || 'Untitled Bill',
              longTitle: bill.longTitle || bill.shortTitle || '',
              summary: bill.summary || '',
              description: bill.summary || `${bill.shortTitle} - Parliamentary Bill`,
              status: 'Unknown',
              stage: 'Unknown',
              currentHouse: bill.currentHouse || 'Unknown',
              introducedDate: bill.introducedDate || bill.dateIntroduced || '',
              lastUpdated: bill.lastUpdate || new Date().toISOString(),
              sponsor: bill.sponsor || 'Unknown',
              promoter: 'Government',
              type: getBillType(bill.billTypeId),
              category: getBillCategory(bill.shortTitle),
              url: `https://bills.parliament.uk/bills/${bill.billId}`,
              parliamentUrl: `https://bills.parliament.uk/bills/${bill.billId}`,
              sessions: [],
              publications: [],
              stages: []
            };
          }
        })
      );
      
      return bills.filter(bill => bill !== null);
    }
    return [];
  } catch (error) {
    console.error('Error fetching bills from Parliament API:', error);
    return [];
  }
}

// Get current status from stage information
function getCurrentStatus(currentStage: any): string {
  if (!currentStage) return 'Unknown';
  
  const stage = currentStage.description || '';
  const house = currentStage.house || '';
  
  if (stage.includes('Royal Assent')) return 'Royal Assent';
  if (stage.includes('Third Reading')) return `Third Reading - ${house}`;
  if (stage.includes('Report Stage')) return `Report Stage - ${house}`;
  if (stage.includes('Committee Stage')) return `Committee Stage - ${house}`;
  if (stage.includes('Second Reading')) return `Second Reading - ${house}`;
  if (stage.includes('First Reading')) return `First Reading - ${house}`;
  
  return stage || 'In Progress';
}

// Get bill type from type ID
function getBillType(typeId: number): string {
  const types: { [key: number]: string } = {
    1: 'Public Bill',
    2: 'Private Bill',
    3: 'Hybrid Bill',
    4: 'Private Members Bill',
    5: 'Government Bill'
  };
  return types[typeId] || 'Unknown';
}

// Get bill category from title
function getBillCategory(title: string): string {
  if (!title) return 'General';
  
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('health') || lowerTitle.includes('nhs')) return 'Health';
  if (lowerTitle.includes('education') || lowerTitle.includes('school')) return 'Education';
  if (lowerTitle.includes('housing') || lowerTitle.includes('planning')) return 'Housing';
  if (lowerTitle.includes('transport') || lowerTitle.includes('railway')) return 'Transport';
  if (lowerTitle.includes('environment') || lowerTitle.includes('climate')) return 'Environment';
  if (lowerTitle.includes('economy') || lowerTitle.includes('finance') || lowerTitle.includes('tax')) return 'Economy';
  if (lowerTitle.includes('justice') || lowerTitle.includes('crime') || lowerTitle.includes('police')) return 'Justice';
  if (lowerTitle.includes('defence') || lowerTitle.includes('security')) return 'Defence';
  if (lowerTitle.includes('digital') || lowerTitle.includes('technology')) return 'Technology';
  if (lowerTitle.includes('immigration') || lowerTitle.includes('border')) return 'Immigration';
  
  return 'General';
}

// Get bills with fallback strategy
async function getBills(): Promise<Bill[]> {
  const cacheKey = 'all_bills';
  let bills = cache.get(cacheKey) as Bill[];

  if (!bills) {
    // Try Parliament API first
    bills = await fetchBillsFromParliamentAPI();
    
    // If API fails, use programmatic fallback data
    if (bills.length === 0) {
      console.log('Parliament Bills API unavailable, using fallback bills data');
      bills = generateFallbackBills();
    }
    
    // Cache for 1 hour
    cache.set(cacheKey, bills, 3600);
  }

  return bills;
}

// GET /api/parliament/bills - Get current bills
router.get('/bills', async (req: express.Request, res: express.Response) => {
  try {
    const bills = await getBills();

    res.json({
      success: true,
      data: bills,
      count: bills.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bills'
    });
  }
});

// GET /api/parliament/bills/:id - Get specific bill
router.get('/bills/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const bills = await getBills();
    const bill = bills.find(b => b.id === id || b.billId.toString() === id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bill'
    });
  }
});

// GET /api/parliament/bills/category/:category - Get bills by category
router.get('/bills/category/:category', async (req: express.Request, res: express.Response) => {
  try {
    const { category } = req.params;
    const bills = await getBills();
    const filteredBills = bills.filter(bill => 
      bill.category.toLowerCase() === category.toLowerCase()
    );

    res.json({
      success: true,
      data: filteredBills,
      count: filteredBills.length,
      category: category
    });
  } catch (error) {
    console.error('Error fetching bills by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bills by category'
    });
  }
});

export default router;
