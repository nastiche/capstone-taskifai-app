import Task from "../../../../db/models/Task";
import dbConnect from "../../../../db/connect";

export default async function handler(request, response) {
  await dbConnect();
  const { dynamicId } = request.query;

  if (!dynamicId) {
    return;
  }

  if (request.method === "GET") {
    const task = await Task.findById(dynamicId);
    if (!task) {
      response.status(404).json({ status: "Not found" });
      return;
    }
    response.status(200).json(task);
    return;
  }
}
