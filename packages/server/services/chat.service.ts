import { conversationRepository } from '../repositories/conversation.repository';
import { OpenAI } from 'openai';

// implementation detail
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatResponse = {
   id: string;
   message: string;
};

// public interface
export const chatService = {
   async sendMessages(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
