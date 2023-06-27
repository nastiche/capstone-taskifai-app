import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";
import { StyledButton } from "../StyledButton/StyledButton";
import { v4 as uuidv4 } from "uuid";

const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const SubtaskWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 3px solid black;
  border-radius: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
`;

const SubtaskInput = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: none;
  border-radius: 0.5rem;
  flex: 1;
  margin-right: 0.5rem;
`;

const Label = styled.label`
  font-weight: 700;
`;

const RadioButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MyTagsWrapper = styled.div`
  .ReactTags__tagInputField {
    width: 100%;
    border: 3px solid black;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: inherit;
  }
`;

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const BoldText = styled.span`
  font-weight: 700;
`;

const DeleteSubtaskButton = styled.button`
  padding: 0.5rem;
  font-size: inherit;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: red;
  font-weight: bold;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
`;

const StyledErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: red;
`;

export default function Form({
  onSubmit,
  formName,
  existingTaskData,
  newAiTaskData,
  aiMode,
}) {
  const [selectedPrio, setSelectedPrio] = useState("");
  const [tags, setTags] = useState([]);
  const titleInputRef = useRef(null);
  const subtaskRef = useRef([]);
  const [subtasks, setSubtasks] = useState([]);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [clearAiTaskDataAfterSave, setClearAiTaskDataAfterSave] =
    useState(false);

  function handleAddSubtask() {
    setAddingSubtask(true);
    const newSubtask = { id: uuidv4(), value: "" };
    setSubtasks((prevSubtasks) => [...prevSubtasks, newSubtask]);
  }

  useEffect(() => {
    if (subtasks.length > 0) {
      subtaskRef.current[subtasks.length - 1]?.focus();
    }
    setAddingSubtask(false);
  }, [addingSubtask]);

  useEffect(() => {
    if (!aiMode) {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    } else {
      const taskDescriptionInput = document.getElementById("task-description");
      if (taskDescriptionInput) {
        taskDescriptionInput.focus();
      }
    }
  }, [aiMode]);

  useEffect(() => {
    if (existingTaskData) {
      if (titleInputRef.current) {
        titleInputRef.current.value = existingTaskData.title;
      }

      setSubtasks(existingTaskData.subtasks);

      const defaultTags = existingTaskData.tags.map((tag, index) => {
        return { id: String(index + 1), text: tag };
      });
      setTags(defaultTags);

      if (existingTaskData?.deadline) {
        const formattedDefaultDeadline = new Date(existingTaskData.deadline)
          .toISOString()
          .split("T")[0];
        document.getElementById("deadline").value = formattedDefaultDeadline;
      }

      setSelectedPrio(existingTaskData.priority);
    }

    if (newAiTaskData && Object.keys(newAiTaskData).length > 0) {
      if (titleInputRef.current) {
        titleInputRef.current.value = newAiTaskData.title;
      }

      setSubtasks(newAiTaskData.subtasks);
    }
  }, [existingTaskData, newAiTaskData]);

  function handleChangeSubtask(subtaskId, subtaskValue) {
    setSubtasks((prevSubtasks) => {
      const updatedSubtasks = prevSubtasks.map((subtask) => {
        if (subtask.id === subtaskId) {
          return { ...subtask, value: subtaskValue };
        }
        return subtask;
      });
      return updatedSubtasks;
    });
  }
  function handleDeleteSubtask(subtaskId) {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.filter((subtask) => subtask.id !== subtaskId)
    );
  }

  function handleTagDelete(index) {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }

  function handleTagAddition(tag) {
    const tagText = tag.text.trim();
    const isTagAlreadyAdded = tags.some(
      (existingTag) => existingTag.text.trim() === tagText
    );

    if (!isTagAlreadyAdded) {
      setTags((prevTags) => [...prevTags, { id: uuidv4(), text: tagText }]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (!aiMode) {
      const subtasksWithId = subtasks
        .map((subtask, index) => ({
          id: uuidv4(),
          value: subtask.value.trim(),
        }))
        .filter((subtask) => subtask.value !== "");
      data.subtasks = subtasksWithId;
      data.tags = tags.map((tag) => tag.text);
      data.creationDate = new Date();

      setSelectedPrio("");
      setTags([]);
      setSubtasks([]);
      titleInputRef.current.value = "";
      setSubtasks([]);
      event.target.reset();
      event.target.elements.title.focus();
      setClearAiTaskDataAfterSave(true);
    }
    onSubmit(data, clearAiTaskDataAfterSave);
    event.target.reset();
  }

  function handleRadioButtonChange(prio) {
    setSelectedPrio(prio);
  }

  function resetForm() {
    if (!aiMode) {
      setSelectedPrio("");
      setTags([]);
      setSubtasks([]);
      titleInputRef.current.value = "";
      setSubtasks([]);
      document.getElementById("deadline").value = "";
    } else {
      document.getElementById("add-task").reset();
      const taskDescriptionInput = document.getElementById("task-description");
      if (taskDescriptionInput) {
        taskDescriptionInput.focus();
      }
    }
  }

  if (!aiMode || (!aiMode && newAiTaskData !== {})) {
    return (
      <>
        <FormContainer
          id={formName}
          aria-labelledby={formName}
          onSubmit={handleSubmit}
        >
          <Label htmlFor="title">title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            rows="1"
            required
            wrap="hard"
            ref={titleInputRef}
            autoFocus
          />
          <BoldText>subtasks</BoldText>
          {subtasks.map((subtask, index) => (
            <SubtaskWrapper key={subtask.id}>
              <SubtaskInput
                id={subtask.id}
                value={subtask.value}
                rows="1"
                wrap="hard"
                onChange={(event) =>
                  handleChangeSubtask(subtask.id, event.target.value)
                }
                ref={(ref) => {
                  subtaskRef.current[index] = ref;
                }}
              />
              <DeleteSubtaskButton
                onClick={() => handleDeleteSubtask(subtask.id)}
              >
                X
              </DeleteSubtaskButton>
            </SubtaskWrapper>
          ))}
          <StyledButton
            type="button"
            onClick={() => {
              handleAddSubtask();
            }}
          >
            add subtask
          </StyledButton>
          <Label htmlFor="tags">tags</Label>
          <MyTagsWrapper>
            <ReactTags
              id="tags"
              name="tags"
              tags={tags}
              handleDelete={handleTagDelete}
              handleAddition={handleTagAddition}
              delimiters={delimiters}
              placeholder="press enter to add new tag"
              maxLength={15}
              allowNew
            />
          </MyTagsWrapper>
          <Label htmlFor="deadline">deadline</Label>
          <Input id="deadline" name="deadline" type="date" rows="1" />
          <BoldText>priority</BoldText>
          <RadioButtonGroup id="priority" name="priority">
            <RadioButtonLabel htmlFor="priority-high">
              <input
                id="priority-high"
                type="radio"
                name="priority"
                value="high"
                checked={selectedPrio === "high"}
                onChange={() => handleRadioButtonChange("high")}
              />
              high
            </RadioButtonLabel>
            <RadioButtonLabel htmlFor="priority-medium">
              <input
                id="priority-medium"
                type="radio"
                name="priority"
                value="medium"
                checked={selectedPrio === "medium"}
                onChange={() => handleRadioButtonChange("medium")}
              />
              medium
            </RadioButtonLabel>
            <RadioButtonLabel htmlFor="priority-low">
              <input
                id="priority-low"
                type="radio"
                name="priority"
                value="low"
                checked={selectedPrio === "low"}
                onChange={() => handleRadioButtonChange("low")}
              />
              low
            </RadioButtonLabel>
          </RadioButtonGroup>
          <StyledButton type="submit">
            {existingTaskData ? "save" : "create"}
          </StyledButton>
          <StyledButton type="button" onClick={resetForm}>
            reset
          </StyledButton>
        </FormContainer>
      </>
    );
  } else {
    return (
      <>
        {newAiTaskData &&
        newAiTaskData.title === "" &&
        newAiTaskData.subtasks.length === 0 &&
        newAiTaskData.tags.length === 0 &&
        newAiTaskData.priority === "" &&
        newAiTaskData.deadline === null ? (
          <StyledErrorDiv>try again</StyledErrorDiv>
        ) : null}
        <FormContainer
          id={formName}
          aria-labelledby={formName}
          onSubmit={handleSubmit}
        >
          <Label htmlFor="task-description">task description</Label>
          <Textarea
            id="task-description"
            name="taskDescription"
            type="text"
            rows="17"
            required
            wrap="hard"
            maxLength={500}
            defaultValue={
              newAiTaskData ? newAiTaskData.originalTaskDescription : ""
            }
          />
          <StyledButton type="submit">create</StyledButton>
          <StyledButton type="button" onClick={resetForm}>
            reset
          </StyledButton>
        </FormContainer>
      </>
    );
  }
}
