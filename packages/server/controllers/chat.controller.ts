import { z } from 'zod';
import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
   prompt: z
      .string()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long'),
   conversationId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResponse = chatSchema.safeParse(req.body);
      if (!parseResponse.success) {
         return res
            .status(400)
            .json({ error: z.treeifyError(parseResponse.error) });
      }

      try {
         const { conversationId, prompt } = parseResponse.data;

         const response = await chatService.sendMessages(
            prompt,
            conversationId
         );

         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate response' });
      }
   },
};
