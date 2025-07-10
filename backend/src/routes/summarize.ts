import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional news editor skilled at creating concise, accurate summaries of political news articles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const summary = completion.data.choices[0]?.message?.content?.trim() || content.slice(0, 200) + '...';

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