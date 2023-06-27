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
  temperature: 0,
  maxTokens: 2000,
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
      template: `Analyze the task description you got from user to extract meaningful information. If the description is coherent and sufficiently long, generate a task title and subtasks based on the description. If the description is nonsensical or too short, create a task to learn how to write precise task descriptions. Ensure that the generated task includes a title (a string, maximum 40 characters long) and subtasks (an array of strings, each string maximum 150 characters long). Maintain a polite and respectful tone throughout the task description. ALWAYS keep you response in the right format (title is a string maximum 40 characters long and subtasks is an array of strings, each string maximum 150 characters long). Title and subtasks in the described format are always required. If you don't know which task you can create of the given description, create a task to learn how to write precise task descriptions.Do your best:\n{format_instructions}\n{query}`,
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
