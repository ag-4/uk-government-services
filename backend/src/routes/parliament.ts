import express from 'express';
import { twfyService } from '../services/theyworkforyou';
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

// Get bills using TheyWorkForYou debates and divisions
async function fetchBillsFromTWFY(): Promise<Bill[]> {
  try {
    // Get recent debates to extract bill information
    const debates = await twfyService.getDebates(100);
    const divisions = await twfyService.getDivisions(50);
    
    // Extract unique bill topics from debates and divisions
    const billTopics = new Set<string>();
    const billsMap = new Map<string, any>();
    
    // Process divisions to create bills
    divisions.forEach((division, index) => {
      const billId = `twfy-bill-${division.id}`;
      const title = division.subject || `Parliamentary Division ${division.number}`;
      
      if (!billsMap.has(billId)) {
        billsMap.set(billId, {
          id: billId,
          billId: division.id,
          title: title,
          longTitle: `A parliamentary matter concerning: ${title}`,
          summary: `This matter was subject to a parliamentary division on ${division.date}. ${division.result === 'Passed' ? 'The motion was approved' : 'The motion was rejected'} with ${division.yes_total} votes in favor and ${division.no_total} against.`,
          description: `Parliamentary division on ${title}. Result: ${division.result}`,
          status: division.result === 'Passed' ? 'Passed' : 'Rejected',
          stage: 'Division Completed',
          currentHouse: division.house === 'commons' ? 'Commons' : 'Lords',
          introducedDate: division.date,
          lastUpdated: division.date,
          sponsor: 'Parliament',
          promoter: 'Government',
          type: 'Parliamentary Motion',
          category: getBillCategory(title),
          url: `https://www.theyworkforyou.com/debates/?id=${division.debate_gid}`,
          parliamentUrl: `https://www.theyworkforyou.com/debates/?id=${division.debate_gid}`,
          sessions: [],
          publications: [],
          stages: [{
            id: 1,
            description: 'Division',
            house: division.house,
            stageSittings: [{
              id: 1,
              date: division.date,
              provisional: false
            }]
          }]
        });
      }
    });
    
    // Add some bills from recent debates
    const debateTopics = debates
      .filter(debate => debate.content && debate.content.length > 50)
      .slice(0, 20)
      .map((debate, index) => {
        const billId = `twfy-debate-${debate.id}`;
        const title = extractBillTitle(debate.content) || `Parliamentary Debate ${index + 1}`;
        
        return {
          id: billId,
          billId: debate.id,
          title: title,
          longTitle: `Parliamentary debate: ${title}`,
          summary: debate.content.substring(0, 200) + '...',
          description: `Parliamentary debate on ${title}`,
          status: 'Under Discussion',
          stage: 'Debate Stage',
          currentHouse: 'Commons',
          introducedDate: debate.date,
          lastUpdated: debate.date,
          sponsor: debate.speaker?.name || 'Parliament',
          promoter: 'Government',
          type: 'Parliamentary Debate',
          category: getBillCategory(title),
          url: debate.url || `https://www.theyworkforyou.com/debates/?id=${debate.id}`,
          parliamentUrl: debate.url || `https://www.theyworkforyou.com/debates/?id=${debate.id}`,
          sessions: [],
          publications: [],
          stages: [{
            id: 1,
            description: 'Debate',
            house: 'Commons',
            stageSittings: [{
              id: 1,
              date: debate.date,
              provisional: false
            }]
          }]
        };
      });
    
    const allBills = [...Array.from(billsMap.values()), ...debateTopics];
    return allBills.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    
  } catch (error) {
    console.error('Error fetching bills from TWFY:', error);
    return [];
  }
}

// Helper function to extract bill titles from debate content
function extractBillTitle(content: string): string | null {
  // Look for common bill patterns
  const patterns = [
    /(?:Bill|Act)\s+(?:on|for|to)\s+([^.]{10,50})/i,
    /([A-Z][^.]{10,50})\s+Bill/i,
    /Motion\s+(?:on|for|to)\s+([^.]{10,50})/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
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

// Get bills with caching
async function getBills(): Promise<Bill[]> {
  const cacheKey = 'twfy_bills';
  let bills = cache.get(cacheKey) as Bill[];

  if (!bills) {
    bills = await fetchBillsFromTWFY();
    
    // If TWFY fails, use fallback data
    if (bills.length === 0) {
      console.log('TheyWorkForYou API unavailable, using fallback bills data');
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

// GET /api/parliament/votes - Get recent voting records from TheyWorkForYou
router.get('/votes', async (req: express.Request, res: express.Response) => {
  try {
    const { limit = 50, house = 'commons' } = req.query;
    
    // Get divisions directly from TheyWorkForYou
    const divisions = await twfyService.getDivisions(parseInt(limit as string));
    
    const votes = divisions.map(division => ({
      id: division.id,
      date: division.date,
      question: division.subject,
      result: division.result,
      ayes: division.yes_total,
      noes: division.no_total,
      abstentions: division.absent_total,
      majority: division.majority,
      turnout: division.turnout,
      house: division.house,
      number: division.number,
      debate_gid: division.debate_gid,
      url: `https://www.theyworkforyou.com/debates/?id=${division.debate_gid}`
    }));
    
    res.json({
      success: true,
      data: votes,
      count: votes.length,
      message: 'Voting records retrieved successfully from TheyWorkForYou'
    });
  } catch (error) {
    console.error('Error fetching voting records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voting records',
      message: 'An error occurred while retrieving voting data'
    });
  }
});

export default router;
