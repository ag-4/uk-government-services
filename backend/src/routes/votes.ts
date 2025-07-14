import express from 'express';
import { twfyService } from '../services/theyworkforyou';
import { cache } from '../server';

const router = express.Router();

interface Vote {
  id: string;
  date: string;
  question: string;
  result: string;
  ayes: number;
  noes: number;
  abstentions: number;
  majority: number;
  turnout: number;
  house: string;
  number: string;
  debate_gid: string;
  url: string;
  description?: string;
  category?: string;
}

// GET /api/votes - Get recent voting records
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 50, 
      house = 'commons', 
      date_from, 
      date_to, 
      search 
    } = req.query;
    
    const cacheKey = `votes_${limit}_${house}_${date_from || 'all'}_${date_to || 'all'}_${search || 'all'}`;
    let votes = cache.get(cacheKey) as Vote[];
    
    if (!votes) {
      // Get divisions from TheyWorkForYou
      const divisions = await twfyService.getDivisions(parseInt(limit as string));
      
      votes = divisions.map(division => ({
        id: division.id,
        date: division.date,
        question: division.subject || `Division ${division.number}`,
        result: division.result,
        ayes: division.yes_total,
        noes: division.no_total,
        abstentions: division.absent_total,
        majority: division.majority,
        turnout: division.turnout,
        house: division.house,
        number: division.number,
        debate_gid: division.debate_gid,
        url: `https://www.theyworkforyou.com/debates/?id=${division.debate_gid}`,
        description: `Parliamentary division on: ${division.subject}`,
        category: categorizeVote(division.subject)
      }));
      
      // Apply filters
      if (house && house !== 'all') {
        votes = votes.filter(vote => vote.house.toLowerCase() === (house as string).toLowerCase());
      }
      
      if (date_from) {
        const fromDate = new Date(date_from as string);
        votes = votes.filter(vote => new Date(vote.date) >= fromDate);
      }
      
      if (date_to) {
        const toDate = new Date(date_to as string);
        votes = votes.filter(vote => new Date(vote.date) <= toDate);
      }
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        votes = votes.filter(vote => 
          vote.question.toLowerCase().includes(searchTerm) ||
          vote.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by date (most recent first)
      votes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Cache for 1 hour
      cache.set(cacheKey, votes, 3600);
    }
    
    res.json({
      success: true,
      data: votes,
      count: votes.length,
      filters: {
        limit: parseInt(limit as string),
        house,
        date_from,
        date_to,
        search
      },
      message: 'Voting records retrieved successfully'
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

// GET /api/votes/:id - Get specific vote details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `vote_${id}`;
    let vote = cache.get(cacheKey) as Vote;
    
    if (!vote) {
      // Get all votes and find the specific one
      const divisions = await twfyService.getDivisions(200);
      const division = divisions.find(d => d.id === id);
      
      if (!division) {
        return res.status(404).json({
          success: false,
          error: 'Vote not found',
          message: `No vote found with ID: ${id}`
        });
      }
      
      vote = {
        id: division.id,
        date: division.date,
        question: division.subject || `Division ${division.number}`,
        result: division.result,
        ayes: division.yes_total,
        noes: division.no_total,
        abstentions: division.absent_total,
        majority: division.majority,
        turnout: division.turnout,
        house: division.house,
        number: division.number,
        debate_gid: division.debate_gid,
        url: `https://www.theyworkforyou.com/debates/?id=${division.debate_gid}`,
        description: `Parliamentary division on: ${division.subject}`,
        category: categorizeVote(division.subject)
      };
      
      // Cache for 6 hours
      cache.set(cacheKey, vote, 21600);
    }
    
    res.json({
      success: true,
      data: vote,
      message: 'Vote details retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching vote details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vote details',
      message: 'An error occurred while retrieving vote data'
    });
  }
});

// GET /api/votes/stats/summary - Get voting statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const cacheKey = 'vote_stats_summary';
    let stats = cache.get(cacheKey);
    
    if (!stats) {
      const divisions = await twfyService.getDivisions(100);
      
      const totalVotes = divisions.length;
      const passedVotes = divisions.filter(d => d.result === 'Passed').length;
      const rejectedVotes = divisions.filter(d => d.result === 'Rejected').length;
      
      const avgTurnout = divisions.reduce((sum, d) => sum + (d.turnout || 0), 0) / totalVotes;
      const avgMajority = divisions.reduce((sum, d) => sum + Math.abs(d.majority || 0), 0) / totalVotes;
      
      // Group by category
      const categories = divisions.reduce((acc, d) => {
        const category = categorizeVote(d.subject);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentVotes = divisions.filter(d => new Date(d.date) >= thirtyDaysAgo).length;
      
      stats = {
        totalVotes,
        passedVotes,
        rejectedVotes,
        passRate: totalVotes > 0 ? (passedVotes / totalVotes * 100).toFixed(1) : 0,
        avgTurnout: avgTurnout.toFixed(1),
        avgMajority: avgMajority.toFixed(0),
        categories,
        recentActivity: recentVotes,
        lastUpdated: new Date().toISOString()
      };
      
      // Cache for 2 hours
      cache.set(cacheKey, stats, 7200);
    }
    
    res.json({
      success: true,
      data: stats,
      message: 'Voting statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching voting statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voting statistics',
      message: 'An error occurred while retrieving voting statistics'
    });
  }
});

// Helper function to categorize votes
function categorizeVote(subject: string): string {
  if (!subject) return 'Other';
  
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes('budget') || subjectLower.includes('tax') || subjectLower.includes('finance')) {
    return 'Finance & Economy';
  }
  if (subjectLower.includes('health') || subjectLower.includes('nhs')) {
    return 'Health';
  }
  if (subjectLower.includes('education') || subjectLower.includes('school') || subjectLower.includes('university')) {
    return 'Education';
  }
  if (subjectLower.includes('environment') || subjectLower.includes('climate') || subjectLower.includes('energy')) {
    return 'Environment & Energy';
  }
  if (subjectLower.includes('defence') || subjectLower.includes('military') || subjectLower.includes('security')) {
    return 'Defence & Security';
  }
  if (subjectLower.includes('transport') || subjectLower.includes('railway') || subjectLower.includes('road')) {
    return 'Transport';
  }
  if (subjectLower.includes('housing') || subjectLower.includes('planning')) {
    return 'Housing & Planning';
  }
  if (subjectLower.includes('justice') || subjectLower.includes('court') || subjectLower.includes('crime')) {
    return 'Justice & Law';
  }
  if (subjectLower.includes('welfare') || subjectLower.includes('benefit') || subjectLower.includes('social')) {
    return 'Social Welfare';
  }
  if (subjectLower.includes('immigration') || subjectLower.includes('border')) {
    return 'Immigration';
  }
  
  return 'Other';
}

export default router;