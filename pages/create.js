import React, { useState } from "react";
import useSWR from "swr";
import Form from "../components/TaskInputForm";
import Switch from "react-switch";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const SwitchWrapper = styled.div`
  display: flex;
`;

const EmptyDiv = styled.div`
  height: 28px;
`;

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: green;
`;

export default function CreateTaskPage() {
  const [aiMode, setAiMode] = useState(true);
  const { mutate } = useSWR("api/tasks");
  const [aiTaskDescription, setAiTaskDescription] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [giveAiTaskDataToForm, setGiveAiTaskDataToForm] = useState(false);

  async function addTask(taskData, resetTaskDataAfterSave) {
    setIsLoading(true);
    if (!aiMode) {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        mutate();
      }
      setGiveAiTaskDataToForm(!resetTaskDataAfterSave);
    } else {
      try {
        const response = await fetch("/api/tasks/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });
        if (response.ok) {
          const aiTaskData = await response.json();
          if (aiTaskData.title !== "" && aiTaskData.subtasks !== []) {
            aiTaskData.subtasks = aiTaskData.subtasks.map((subtask) => ({
              ...subtask,
              value: subtask,
              id: uuidv4(),
            }));
            setAiTaskDescription(aiTaskData);
            setAiMode(false);
          } else {
            setAiTaskDescription({
              title: "",
              subtasks: [],
              tags: [],
              deadline: null,
              priority: "",
              originalTaskDescription: taskData.taskDescription,
            });
            setAiMode(true);
          }
        } else {
          console.error("Failed to generate task");
          setAiTaskDescription({
            title: "",
            subtasks: [],
            tags: [],
            deadline: null,
            priority: "",
            originalTaskDescription: taskData.taskDescription,
          });
          setAiMode(true);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsLoading(false);
  }
  console.log(aiTaskDescription);
  return (
    <>
      {isLoading ? (
        <>
          <EmptyDiv></EmptyDiv>
          <StyledLoadingDiv>...creating task...</StyledLoadingDiv>
        </>
      ) : (
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
          {giveAiTaskDataToForm ? (
            <Form
              onSubmit={addTask}
              formName={"add-task"}
              aiMode={aiMode}
            ></Form>
          ) : (
            <Form
              onSubmit={addTask}
              formName={"add-task"}
              newAiTaskData={aiTaskDescription}
              aiMode={aiMode}
            ></Form>
          )}
        </>
      )}
    </>
  );
}
