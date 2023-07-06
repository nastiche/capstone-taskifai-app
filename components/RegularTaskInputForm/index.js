import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";
import { StyledButton } from "../StyledButton/StyledButton";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Button, ButtonsContainer } from "../Button/Button";
import { NavigationLinkWrapper } from "../NavigationLink/NavigationLink";
import Link from "next/link";

// Task data for initial state
const initialTaskData = {
  title: "",
  subtasks: [],
  tags: [],
  deadline: "",
  priority: "",
  original_task_description: "",
};

export default function RegularTaskInputForm({
  onSubmit,
  formName,
  existingTaskData,
  newAiTaskData,
  aiResponseStatus,
}) {
  // Reference for title and subtasks form input fields
  const titleInputRef = useRef(null);
  const subtaskRef = useRef([]);

  // State for form input fields' values
  const [taskData, setTaskData] = useState(initialTaskData);

  // State used to check whether a new subtask input field was added
  const [addingSubtask, setAddingSubtask] = useState(false);

  // State used for reset of the tags input field value
  // (in case the user enters text in the input field and doesn't press enter to create a tag, the text stays in the input field)
  const [tagInputValue, setTagInputValue] = useState("");

  //  State to check whether user chose an image to attach to the task
  const [imageChosen, setImageChosen] = useState(false);

  // Focus on title input field after page refresh
  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  // Hook used to check whether the input form gets
  //  the prop existingTaskData (comes from TaskEditPage) or the prop newAiTaskData (comes from CreateTaskPage)
  useEffect(() => {
    if (existingTaskData) {
      // Set taskData to existingTaskData
      setTaskData(existingTaskData);

      // Set values of tags and deadline to correct format
      const formattedTags = existingTaskData.tags.map((tag, index) => ({
        id: String(index + 1),
        text: tag,
      }));

      const formattedDeadline = existingTaskData.deadline
        ? new Date(existingTaskData.deadline).toISOString().split("T")[0]
        : null;

      // Populate taskData with tags and deadline in correct format
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        tags: formattedTags,
        deadline: formattedDeadline,
      }));
    }

    if (newAiTaskData) {
      setTaskData(newAiTaskData);
    }
  }, [existingTaskData, newAiTaskData]);

  // Function to handle adding a subtask
  function handleAddSubtask() {
    setAddingSubtask(true);
    const newSubtask = { value: "", id: uuidv4() };
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      subtasks: [...prevTaskData.subtasks, newSubtask],
    }));
  }

  // Focus on the latest added subtask input field
  useEffect(() => {
    if (taskData.subtasks.length > 0) {
      subtaskRef.current[taskData.subtasks.length - 1]?.focus();
    }
    setAddingSubtask(false);
  }, [addingSubtask]);

  // Handle title field change
  function handleChangeTitle(event) {
    const { name, value } = event.target;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  }

  // Handle subtask input field change
  function handleChangeSubtask(subtaskId, subtaskValue) {
    setTaskData((prevTaskData) => {
      const updatedSubtasks = prevTaskData.subtasks.map((subtask) => {
        if (subtask.id === subtaskId) {
          return { ...subtask, value: subtaskValue };
        }
        return subtask;
      });
      return { ...prevTaskData, subtasks: updatedSubtasks };
    });
  }

  // Handle deleting a subtask
  function handleDeleteSubtask(subtaskId) {
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      subtasks: prevTaskData.subtasks.filter(
        (subtask) => subtask.id !== subtaskId
      ),
    }));
  }

  // Handle adding a tag
  function handleTagAddition(tag) {
    const tagText = tag.text.trim();
    const isTagAlreadyAdded = taskData.tags.some(
      (existingTag) => existingTag.text.trim() === tagText
    );

    if (!isTagAlreadyAdded) {
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        tags: [...prevTaskData.tags, { id: uuidv4(), text: tagText }],
      }));
    }
    setTagInputValue("");
  }

  // Handle deleting a tag
  function handleTagDelete(index) {
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      tags: prevTaskData.tags.filter((_, i) => i !== index),
    }));
  }

  // Handle deadline field change
  function handleChangeDeadline(event) {
    const { name, value } = event.target;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  }

  // Handle radio button change for priority selection
  function handleRadioButtonChange(newPriority) {
    setTaskData({ ...taskData, priority: newPriority });
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskFormData = Object.fromEntries(formData);

    // Populate form data with filtered subtasks array, tags array,
    // original task description (user's query), and creation date
    const subtasksNotEmptyStrings = taskData.subtasks.filter(
      (subtask) => subtask.value !== ""
    );
    taskFormData.subtasks = subtasksNotEmptyStrings;
    taskFormData.tags = taskData.tags.map((tag) => tag.text);
    taskFormData.creation_date = new Date();
    taskFormData.original_task_description = taskData.original_task_description;
    if (existingTaskData) {
      taskFormData.edit_date = new Date();
    }

    if (!taskFormData.priority) {
      taskFormData.priority = "none";
    }

    console.log(taskFormData);
    let imageUrl = "";
    if (imageChosen) {
      const response = await fetch("/api/tasks/image", {
        method: "post",
        body: formData,
      });

      const imageDetails = await response.json();
      imageUrl = imageDetails.url;
      // Add the image URL to the form data
      taskFormData.image_url = imageUrl;
    }

    // Submit form data
    onSubmit(taskFormData);

    // Reset form
    setTaskData(initialTaskData);
    setTagInputValue("");
    event.target.elements.title.focus();
    setImageChosen(false);
  }

  // Resets the form to initial state (function for reset button)
  function resetForm() {
    setTaskData(initialTaskData);
    setTagInputValue("");

    // Reset file input value
    const fileInput = document.getElementById("image_upload");
    if (fileInput) {
      fileInput.value = "";
    }
    titleInputRef.current.focus();
  }

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
          value={taskData.title}
          onChange={handleChangeTitle}
          autoFocus
          maxLength={44}
        />
        <BoldText>subtasks</BoldText>
        {taskData.subtasks && taskData.subtasks.length > 0
          ? taskData.subtasks.map((subtask, index) => (
              <SubtaskWrapper key={subtask.id}>
                <SubtaskInput
                  id={subtask.id}
                  value={subtask.value}
                  rows="1"
                  wrap="hard"
                  maxLength={84}
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
            ))
          : null}
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
            tags={taskData.tags}
            handleDelete={handleTagDelete}
            handleAddition={handleTagAddition}
            delimiters={delimiters}
            placeholder="press enter to add new tag"
            maxLength={15}
            inputValue={tagInputValue}
            handleInputChange={(tag) => setTagInputValue(tag)}
            allowNew
          />
        </MyTagsWrapper>
        <Label htmlFor="deadline">deadline</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          rows="1"
          value={taskData.deadline}
          onChange={handleChangeDeadline}
        />
        <BoldText>priority</BoldText>
        <RadioButtonGroup id="priority" name="priority">
          <RadioButtonLabel htmlFor="priority-high">
            <input
              id="priority-high"
              type="radio"
              name="priority"
              value="high"
              checked={taskData.priority === "high"}
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
              checked={taskData.priority === "medium"}
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
              checked={taskData.priority === "low"}
              onChange={() => handleRadioButtonChange("low")}
            />
            low
          </RadioButtonLabel>
        </RadioButtonGroup>
        {taskData.image_url && taskData.image_url !== "" ? (
          <>
            <BoldText>image: </BoldText>
            <TaskImage
              alt="image"
              src={taskData.image_url}
              width="100"
              height="100"
            />
          </>
        ) : null}

        <Label htmlFor="image_upload">
          {existingTaskData && existingTaskData.image_url !== ""
            ? "change image:"
            : "upload image:"}
        </Label>
        <input
          type="file"
          id="image_upload"
          name="file"
          onChange={() => setImageChosen(true)}
        ></input>
        {(taskData.original_task_description !== null &&
          taskData.original_task_description !== "" &&
          aiResponseStatus) ||
        (taskData.original_task_description !== null &&
          taskData.original_task_description !== "" &&
          existingTaskData) ? (
          <>
            <Label htmlFor="original_task_description">
              original task description
            </Label>
            <Textarea
              id="original_task_description"
              name="original_task_description"
              type="text"
              required
              wrap="hard"
              value={taskData.original_task_description}
              rows="5"
              disabled
            />
          </>
        ) : null}
        <ButtonsContainer variant="fixed">
          <NavigationLinkWrapper>
            <Link href={`/`} passHref legacyBehavior aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                width="30px"
                height="30px"
                aria-label="go to the previous page"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </Link>
          </NavigationLinkWrapper>
          <Button type="submit" variant="positive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              width="40px"
              height="40px"
              aria-label="create task"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </Button>
          <Button type="button" onClick={resetForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              width="30px"
              height="30px"
              aria-label="reset form"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </Button>
        </ButtonsContainer>
      </FormContainer>
    </>
  );
}

// Styled components for the form layout
const FormContainer = styled.form`
  display: grid;

  grid-template-columns: auto;
  margin-bottom: 110px;
  gap: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
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

// Key codes for tags delimiters
const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

// Tags delimiters
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

const TaskImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
