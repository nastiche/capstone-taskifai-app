import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  subtasks: [
    {
      id: { type: String },
      value: { type: String },
    },
  ],
  deadline: { type: Date },
  tags: {
    type: [String],
    default: [],
  },
  priority: { type: String },
  originalTaskDescription: { type: String },
  creationDate: { type: Date },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
