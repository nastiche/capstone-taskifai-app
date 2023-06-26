import React, { useState } from "react";
import useSWR from "swr";
import Form from "../components/TaskInputForm";
import Switch from "react-switch";
import styled from "styled-components";

const SwitchWrapper = styled.div`
  display: flex;
`;

export default function CreateTaskPage() {
  const [aiMode, setAiMode] = useState(true);
  const { mutate } = useSWR("api/tasks");

  async function addTask(task) {
    if (!aiMode) {
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
    } else {
      const response = await fetch("/api/tasks/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        const taskData = await response.json();
      } else {
        const taskData = { title: "", subtasks: [], tags: [] };
        console.error("Failed to generate task");
      }
    }
  }

  return (
    <>
      <SwitchWrapper>
        <label>
          AI mode
          <Switch
            checked={aiMode}
            onChange={() => setAiMode(!aiMode)}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={24}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={16}
            width={40}
          />
        </label>
      </SwitchWrapper>
      {aiMode ? (
        <Form onSubmit={addTask} formName={"add-task"} aiMode={aiMode}></Form>
      ) : (
        <Form onSubmit={addTask} formName={"add-task"}></Form>
      )}
    </>
  );
}
