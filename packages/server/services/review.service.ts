import {OpenAI} from "openai/client";
import {reviewRepository} from "../repositories/review.respository";
import {llmClient} from "../llm/client";

export const reviewService = {
    async getReviews(productId: number) {
        return reviewRepository.getReviews(productId);
    },
    async summarizeReviews(productId: number): Promise<string> {
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map(r => r.content).join('\n\n');
        const prompt = `Summarize the following customer reviews into a short paragraph highlighting key themes, 
        both positive and negative:
        
        ${joinedReviews}`

        const response =  await llmClient.generateText({
            model: 'gpt-4o-mini',
            input: prompt,
            temperature: 0.2,
            maxTokens: 500,
        });
        return response.text;
    }
};

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
