import express from 'express';
// import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

router.post('/summarize', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required for summarization'
      });
    }

    const prompt = `Please provide a concise summary of the following news article in about 2-3 sentences. Focus on the key points and maintain a neutral, journalistic tone:\n\n${content}`;

    // TODO: Implement OpenAI integration when openai package is available
    // For now, provide a simple fallback summary
    const summary = content.length > 200 ? content.slice(0, 200) + '...' : content;

    res.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary'
    });
  }
});

export default router;