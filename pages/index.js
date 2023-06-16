import useSWR from "swr";
import Form from "../components/TaskInputForm";

export default function CreateTaskPage() {
  const { data } = useSWR("/api/tasks", { fallbackData: [] });
  // console.log(data);

  async function addTask(task) {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    // if (response.ok) {
    //   mutate();
    // }
  }
  return <Form onSubmit={addTask} formName={"add-task"}></Form>;
}
