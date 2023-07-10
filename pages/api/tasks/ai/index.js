// Importing necessary modules and libraries
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

// Creating an instance of the OpenAI class with the specified model configuration
const openAIModel = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  maxTokens: 2000,
});

// Creating a structured output parser using the zod library to define the expected output schema
const outputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    Title: z.string().default(""),
    Subtasks: z.array(z.string()).default([]),
  })
);

// Creating an output fixing parser using the OpenAIChat instance and the output parser
const outputFixingParser = OutputFixingParser.fromLLM(
  openAIModel,
  outputParser
);

// Defining the handler function that will be executed upon receiving a request
export default async function handler(request, response) {
  try {
    // Extracting the task description from the request body
    const query = await request.body.original_task_description;

    // Creating a prompt template with the necessary instructions and input variables
    const promptTemplate = new PromptTemplate({
      template: `Analyze the task description provided by the user to extract meaningful information. If the description is coherent and sufficiently long, generate a precise task title and up to five subtasks based on the description. If the description is nonsensical or too short, create a task to learn how to write precise task descriptions.

      Ensure that the generated task includes a title and subtasks. Title should be a string, maximum 40 characters long and subtasks should be an array of strings, each string maximum 150 characters long. Maintain a polite and respectful tone throughout the task description.
    
      Please ensure that the generated task adheres to the following guidelines:
      - The title should be concise and descriptive.
      - Include up to five subtasks, keeping each subtask as short as possible.
      - Maintain a polite and respectful tone throughout the task description.
      - Never give back information about what format you used to create the task details.
    
      {format_instructions}
      {query}`,
      inputVariables: ["query"],
      partialVariables: {
        format_instructions: outputFixingParser.getFormatInstructions(),
      },
    });

    // Creating an instance of the LLMChain class with the OpenAIChat instance, prompt template, and output configuration
    const chain = new LLMChain({
      llm: openAIModel,
      prompt: promptTemplate,
      outputKey: "task",
      outputParser: outputFixingParser,
    });

    // Calling the LLMChain instance with the query as input
    const result = await chain.call({
      query: query,
    });

    // Extracting the generated task object from the result
    const object = result.task;

    // Creating an AI task data object with the extracted task details and other information
    const newAiTaskData = {
      title: object.Title,
      subtasks: object.Subtasks,
      tags: [],
      deadline: null,
      priority: "",
      originalTaskDescription: query,
    };

    // Sending the AI task data as a JSON response to front-end
    response.status(200).json(newAiTaskData);
  } catch (error) {
    console.error(error);

    // Sending an error response if task generation fails
    response.status(500).json({ error: "Failed to generate task" });
  }
}
