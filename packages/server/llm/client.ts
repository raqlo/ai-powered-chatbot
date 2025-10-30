import {OpenAI} from "openai/client";

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

type GenerateTextParams = {
    model?: string,
    input: string,
    temperature?: number,
    maxTokens?: number,
    instructions?: string,
    previousResponseId?: string
}

type GenerateTextResponse = {
    id: string,
    text: string,
}

export const llmClient = {
    async generateText({
                           model = 'gpt-4.1',
                           input,
                           temperature = 0.2,
                           maxTokens = 100,
                           instructions,
                           previousResponseId
                       }: GenerateTextParams): Promise<GenerateTextResponse> {

        const response = await client.responses.create({
            model,
            input,
            temperature,
            max_output_tokens: maxTokens,
            instructions,
            previous_response_id: previousResponseId
        })
        return {
            id: response.id,
            text: response.output_text
        };
    }
}

