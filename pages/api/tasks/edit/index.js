import Task from "../../../../db/models/Task";
import dbConnect from "../../../../db/connect";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (!id) {
    return;
  }

  if (request.method === "GET") {
    try {
      const task = await Task.findById(id);
      if (!task) {
        response.status(404).json({ status: "Not found" });
        return;
      }
      response.status(200).json(task);
    } catch (error) {
      response.status(500).json({ status: "Error fetching task" });
    }
    return;
  }

  if (request.method === "PATCH") {
    await Task.findByIdAndUpdate(id, {
      $set: request.body,
    });
    response.status(200).json({ status: `Task ${id} updated` });
  }
}
