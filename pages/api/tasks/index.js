// Importing necessary modules and libraries
import dbConnect from "../../../db/connect";
import Task from "../../../db/models/Task";
import process from "node:process";
import cloudinary from "cloudinary";
import formidable from "formidable";

// formidable does not work with the default api settings o Next.js, so we disable the bodyParser via config
export const config = {
  api: {
    bodyParser: false,
  },
};

// set the cloudinary config to use your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Defining the handler function that will be executed upon receiving a request
export default async function handler(request, response) {
  // Connecting to the database
  await dbConnect();

  // Check for POST
  if (request.method === "POST") {
    try {
      // Initialise object for task data
      let newTaskDataObject = {};

      // Initialize formidable
      const form = formidable({});

      // Using formidables' parse method to get a simple access to the file data
      form.parse(request, async (error, fields, files) => {
        // return an error status if parsing fails
        if (error) {
          return response.status(500).json({ error: error.message });
        }
        console.log(fields);
        // Populate object for task data with data in right format
        newTaskDataObject = {
          title: fields.title[0],
          deadline: fields.deadline ? fields.deadline[0] : "",
          priority:
            fields.priority && fields.priority[0] !== "undefined"
              ? fields.priority[0]
              : "",
          original_task_description: fields.original_task_description
            ? fields.original_task_description[0]
            : null,
          creation_date: fields.creation_date
            ? new Date(fields.creation_date[0])
            : "",
          tags: fields.tags ? fields.tags.map((tag) => tag) : [],
          subtasks: fields.subtasks
            ? fields.subtasks.map((subtask) => JSON.parse(subtask))
            : [],
        };

        newTaskDataObject.subtasks = newTaskDataObject.subtasks.map(
          (subtask) => ({
            value: subtask.value,
            id: subtask.id,
          })
        );
        // Deconstruct file from files data, will return an array with one element
        const { file } = files;

        // Deconstruct the needed values from file object at index 0

        const { newFilename, filepath } = file[0];

        // Call cloudinary uploader with the required arguments
        const result = await cloudinary.v2.uploader.upload(filepath, {
          public_id: newFilename,
        });

        // Populate the task data object with the file URL
        newTaskDataObject.file_url = result.url;

        // Creating a new task in the database using the Task model
        await Task.create(newTaskDataObject);

        // Sending a success response with a status code of 201 and a JSON object indicating task creation
        return response.status(201).json({ status: "Task created" });
      });
    } catch (error) {
      console.log(error);

      // Sending an error response with a status code of 400 and a JSON object containing the error message
      return response.status(400).json({ error: error.message });
    }
    // Check for GET
  } else if (request.method === "GET") {
    try {
      // Retrieving all tasks from the database using the Task model
      const tasks = await Task.find();

      // Sending a success response with a status code of 200 and a JSON array containing the tasks
      return response.status(200).json(tasks);
      // Add this return statement to properly send the response
    } catch (error) {
      console.log(error);

      // Sending an error response with a status code of 400 and a JSON object containing the error message
      return response.status(400).json({ error: error.message });
    }
  }
}
