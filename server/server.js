import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();  // Load environment variables from .env file

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Access the OpenAI API key from environment variables
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k', // Use the appropriate model ID
      messages: messages,
      temperature: 0.7, // Adjusted for better balance between randomness and determinism
      max_tokens: 3000, // The maximum number of tokens to generate in the completion
      top_p: 1, // Nucleus sampling parameter
      frequency_penalty: 0.5, // Penalizes repetition
      presence_penalty: 0, // Encourages new topic generation
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
