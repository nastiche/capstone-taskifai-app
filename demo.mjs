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

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      Title: z.string().max(40).optional().default(""),
      Subtasks: z.array(z.string().max(150)).optional().default([]),
      Tags: z.array(z.string().max(20)).optional().default([]),
    })
    .nonstrict()
);

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 1,
});

const outputFixingParser = OutputFixingParser.fromLLM(model, outputParser);

const promptTemplate = new PromptTemplate({
  template: `Analyze text to extract meaningful information. If the text is coherent and sufficiently long, generate a task based on the text. Task should have a title, subtasks and tags. If the text is nonsensical or too short, create a task to learn how to write precise task descriptions (task should contain a title, subtasks and tags). Ensure that the generated task details include a title, subtasks and tags. Concatenate multiple words in a tag with underscores and write them in lowercase. Maintain a polite and respectful tone throughout the task description. Do your best:\n{format_instructions}\n{query}`,
  inputVariables: ["query"],
  partialVariables: {
    format_instructions: outputFixingParser.getFormatInstructions(),
  },
});

const chain = new LLMChain({
  llm: model,
  prompt: promptTemplate,
  outputKey: "task",
  outputParser: outputFixingParser,
});

const result = await chain.call({
  query: "plan birthday party for Anna",
});

const object = result.task;
const taskData = JSON.stringify({
  title: object.Title,
  subtasks: object.Subtasks,
  tags: object.Tags,
});

console.log(taskData);
