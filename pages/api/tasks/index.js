import dbConnect from "../../../db/connect";
import Task from "../../../db/models/Task";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    try {
      const taskData = request.body;
      await Task.create(taskData);
      await 
      response.status(201).json({ status: "Task created" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }

  if (request.method === "GET") {
    const tasks = await Task.find();
    response.status(200).json(tasks);
    return;
  }
}
