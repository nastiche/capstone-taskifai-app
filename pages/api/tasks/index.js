// Importing necessary modules and libraries
import dbConnect from "../../../db/connect";
import Task from "../../../db/models/Task";

// Defining the handler function that will be executed upon receiving a request
export default async function handler(request, response) {
  // Connecting to the database
  await dbConnect();

  const { id } = request.query;

  // Handling POST requests
  if (request.method === "POST") {
    try {
      // Extracting task data from the request body
      const taskData = request.body;

      // Creating a new task in the database using the Task model
      await Task.create(taskData);

      // Sending a success response with a status code of 201 and a JSON object indicating task creation
      await response.status(201).json({ status: "Task created" });
    } catch (error) {
      console.log(error);

      // Sending an error response with a status code of 400 and a JSON object containing the error message
      response.status(400).json({ error: error.message });
    }
  }

  // Handling GET requests
  if (request.method === "GET") {
    // Retrieving all tasks from the database using the Task model
    const tasks = await Task.find();

    // Sending a success response with a status code of 200 and a JSON array containing the tasks
    response.status(200).json(tasks);
    return;
  }

  if (request.method === "DELETE") {
    await Task.findByIdAndDelete(id);
    response.status(200).json({ status: `Task ${id} deleted` });
  }
}
