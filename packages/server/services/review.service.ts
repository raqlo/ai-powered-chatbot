import {OpenAI} from "openai/client";
import {reviewRepository} from "../repositories/review.respository";
import {llmClient} from "../llm/client";
import template from '../prompts/summarize-reviews.txt'

export const reviewService = {
    async getReviews(productId: number) {
        return reviewRepository.getReviews(productId);
    },
    async summarizeReviews(productId: number): Promise<string> {
        const existingSummary = await reviewRepository.getReviewSummary(productId);
        if(existingSummary && existingSummary.expiresAt > new Date()) {
            return existingSummary.content
        }

        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map(r => r.content).join('\n\n');
        const prompt = template.replace('{{reviews}}', joinedReviews);

        const { text: summary} =  await llmClient.generateText({
            model: 'gpt-4o-mini',
            input: prompt,
            temperature: 0.2,
            maxTokens: 500,
        });

        await reviewRepository.storeReviewSummary(productId, summary);
        return summary;
    }
};

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
