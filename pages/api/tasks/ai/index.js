import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

const apiKey = process.env.OPENAI_API_KEY;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;

console.log(apiKey);
console.log(azureApiKey);

const openAIModel = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  maxTokens: 2000,
  apiKey: apiKey,
});

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      Title: z.string().optional().default(""),
      Subtasks: z.array(z.string()).optional().default([]),
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
      template: `Analyze the task description provided by the user to extract meaningful information. If the description is coherent and sufficiently long, generate a precise task title and subtasks based on the description. If the description is nonsensical or too short, create a task to learn how to write precise task descriptions. Ensure that the generated task includes a title (a string, maximum 40 characters long) and subtasks (an array of strings, each string maximum 150 characters long). Maintain a polite and respectful tone throughout the task description. It is important to always keep your response in the specified format (title as a string, maximum 40 characters long, and subtasks as an array of strings, each string maximum 150 characters long). Title and subtasks in the described format are always required. If you are uncertain about the appropriate task to create based on the given description, generate a task to learn how to write precise task descriptions. Please do your best to follow these guidelines:\n{format_instructions}\n{query}`,
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

    const object = result.task;

    const aiTaskData = {
      title: object.Title,
      subtasks: object.Subtasks,
      deadline: null,
      tags: [],
      priority: "",
      originalTaskDescription: query,
    };
    console.log(aiTaskData);
    response.status(200).json(aiTaskData);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: "Failed to generate task" });
  }
}
