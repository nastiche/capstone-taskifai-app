import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

import * as dotenv from "dotenv";
dotenv.config();

const openAIModel = new OpenAI({
  modelName: "gpt-3.5-turbo",
  max_tokens: 2000,
  temperature: 1,
});

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      Title: z.string().max(40).optional().default(""),
      Subtasks: z.array(z.string().max(150)).optional().default([]),
      Tags: z.array(z.string().max(20)).optional().default([]),
    })
    .nonstrict()
);

const outputFixingParser = OutputFixingParser.fromLLM(
  openAIModel,
  outputParser
);

export default async function handler(request, response) {
  try {

    const query = await request.body.taskDescription;

    const promptTemplate = new PromptTemplate({
      template: `Analyze text to extract meaningful information. If the text is coherent and sufficiently long, generate a task based on the text. If the text is nonsensical or too short, create a task to learn how to write precise task descriptions. Ensure that the generated task includes a title, subtasks and tags. Concatenate multiple words in a tag with underscores and write them in lowercase. Maintain a polite and respectful tone throughout the task description. Do your best:\n{format_instructions}\n{query}`,
      inputVariables: ["query"],
      partialVariables: {
        format_instructions: outputFixingParser.getFormatInstructions(),
      },
    });

    const chain = new LLMChain({
      llm: openAIModel,
      prompt: promptTemplate,
      outputKey: "task",
      outputParser: outputFixingParser,
    });

    const result = await chain.call({
      query: query,
    });

    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to generate task" });
  }
}
