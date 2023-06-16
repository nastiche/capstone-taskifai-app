import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  subtasks: {
    type: [String],
    default: [],
  },
  deadline: { type: Date },
  category: { type: String },
  prioritisation: { type: String },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
