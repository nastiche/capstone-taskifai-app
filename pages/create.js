import useSWR from "swr";
import Form from "../components/TaskInputForm";
import styled from "styled-components";

const StyledTitle = styled.h2`
  margin: 0.3rem 0;
  font-size: 1.3rem;
`;

export default function CreateTaskPage() {
  const { mutate } = useSWR("api/tasks"); //vlt "/"" vor api ????

  async function addTask(task) {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      mutate();
    }
  }
  return (
    <>
      <StyledTitle id="add-task">Add Task</StyledTitle>
      <Form onSubmit={addTask} formName={"add-task"}></Form>
    </>
  );
}
