import React, { useState } from "react";
import useSWR from "swr";
import Form from "../components/TaskInputForm";
import Switch from "react-switch";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

export default function CreateTaskPage() {
  // State variables
  const [aiMode, setAiMode] = useState(true);
  const { mutate } = useSWR("api/tasks");
  const [aiTaskDetails, setAiTaskDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [giveAiTaskDataToForm, setGiveAiTaskDataToForm] = useState(false);

  // Function to add a task
  async function addTask(taskData, clearAiTaskDataAfterSave) {
    setIsLoading(true);
    if (!aiMode) {
      // Send a POST request to create a task
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        // Trigger a re-fetch of tasks after successful creation
        mutate();
      }
      setGiveAiTaskDataToForm(!clearAiTaskDataAfterSave);
    } else {
      try {
        // Send a POST request to generate an AI task
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
            // Add unique ID and a value key to each subtask
            aiTaskData.subtasks = aiTaskData.subtasks.map((subtask) => ({
              ...subtask,
              value: subtask,
              id: uuidv4(),
            }));
            setAiTaskDetails(aiTaskData);
            setAiMode(false);
          } else {
            // Handle case when AI task generation does not provide valid data
            setAiTaskDetails({
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
          // Handle case when AI task generation fails
          setAiTaskDetails({
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

  return (
    <>
      {isLoading ? (
        // Display loading UI when the task is being created
        <>
          <EmptyDiv></EmptyDiv>
          <StyledLoadingDiv>...creating task...</StyledLoadingDiv>
        </>
      ) : (
        // Display the task input form and switch for AI mode
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
            // Render the task input form without AI-generated data
            <Form
              onSubmit={addTask}
              formName={"add-task"}
              aiMode={aiMode}
            ></Form>
          ) : (
            // Render the task input form with AI-generated data
            <Form
              onSubmit={addTask}
              formName={"add-task"}
              newAiTaskData={aiTaskDetails}
              aiMode={aiMode}
            ></Form>
          )}
        </>
      )}
    </>
  );
}

// Styled components
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
