import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Button } from "../Button/Button";
import { IconContainer } from "../IconContainer";
import { Icon } from "../Icon";
import { StyledLink } from "../NavigationLink/NavigationLink";
import { toast } from "react-toastify";

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
  const subtaskInputRef = useRef([]);
  const fileInputRef = useRef(null);
  const deadlineInputRef = useRef(null);

  // State for form input fields' values
  const [taskData, setTaskData] = useState(initialTaskData);

  // State used to check whether a new subtask input field was added
  const [addingSubtask, setAddingSubtask] = useState(false);

  // State used for reset of the tags input field value
  // (in case the user enters text in the input field and doesn't press enter to create a tag, the text stays in the input field)
  const [tagInputValue, setTagInputValue] = useState("");

  //  State to check whether user chose an image to attach to the task
  const [currentImageValue, setCurrentImageValue] = useState("");

  // Focus on title input field after page refresh
  useEffect(() => {
    titleInputRef.current.focus();
    setTaskData(initialTaskData);
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
      subtaskInputRef.current[taskData.subtasks.length - 1]?.focus();
    }
    setAddingSubtask(false);
  }, [addingSubtask]);

  // Handle title field change
  function handleChangeTitle(event) {
    const { scrollHeight, clientHeight } = event.target;
    event.target.style.height = "auto";
    event.target.style.height = `${Math.max(scrollHeight, clientHeight)}px`;

    const { name, value } = event.target;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  }

  // Handle subtask input field change
  function handleChangeSubtask(event, subtaskId) {
    const subtaskValue = event.target.value;
    const { scrollHeight, clientHeight } = event.target;
    event.target.style.height = "auto";
    event.target.style.height = `${Math.max(scrollHeight, clientHeight)}px`;
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

  // Handle input change in the tags input field
  function handleChangeTag(input) {
    const lastCharacter = input.slice(-1);
    const isValidCharacter = /^[a-zA-Z0-9-_]+$/.test(lastCharacter);
    const isValidDelimiter = [",", ";"].includes(lastCharacter);

    if (!isValidCharacter && !isValidDelimiter) {
      // Show a warning or error message to the user
      console.log("Invalid character entered!");
      return;
    }

    setTagInputValue(input);
  }

  function handleTagAddition(tag) {
    let tagText = tag.text.trim().toLowerCase();
    const isTagAlreadyAdded = taskData.tags.some(
      (existingTag) => existingTag.text.trim().toLowerCase() === tagText
    );

    if (taskData.tags.length < 2 && !isTagAlreadyAdded) {
      if (!/^[a-zA-Z0-9-_]+$/.test(tagText)) {
        // Remove the last character if it doesn't match the pattern
        tagText = tagText.slice(0, -1);
      }

      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        tags: [...prevTaskData.tags, { id: uuidv4(), text: `#${tagText}` }],
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
  console.log(`AI: ${newAiTaskData}, edit: ${existingTaskData}`);
  // Handle radio button change for priority selection
  function handleRadioButtonChange(newPriority) {
    setTaskData({ ...taskData, priority: newPriority });
  }

  function handleFileDelete() {
    setCurrentImageValue("");
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      image_url: "",
    }));
    const fileInput = document.getElementById("image_upload");
    if (fileInput) {
      fileInput.value = "";
    }
  }
  console.log(
    `currentImageValue: ${currentImageValue}; taskData.image_url: ${taskData.image_url}`
  );
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

    if (taskData.image_url === "") {
      taskFormData.image_url = "";
    }

    let imageUrl = "";
    if (currentImageValue !== "" && currentImageValue !== undefined) {
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
    setCurrentImageValue("");
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
        <TitleInput
          id="title"
          name="title"
          type="text"
          rows="1"
          required
          wrap="hard"
          ref={titleInputRef}
          value={taskData.title}
          onChange={(event) => handleChangeTitle(event)}
          autoFocus
          maxLength={50}
          variant={
            existingTaskData || newAiTaskData.title !== ""
              ? "big-data"
              : "empty data"
          }
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
                  onChange={(event) => handleChangeSubtask(event, subtask.id)}
                  ref={(ref) => {
                    subtaskInputRef.current[index] = ref;
                  }}
                />
                <DeleteSubtaskButton
                  variant="extra-small"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                >
                  <Icon labelText={"remove subtask"} />
                </DeleteSubtaskButton>
              </SubtaskWrapper>
            ))
          : null}
        <IconContainer>
          <Button
            variant="small"
            type="button"
            onClick={() => {
              handleAddSubtask();
            }}
            aria-hidden="true"
          >
            <Icon labelText={"add subtask"} />
          </Button>
        </IconContainer>
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
            maxLength={12}
            inputValue={tagInputValue}
            handleInputChange={(event) => handleChangeTag(event)}
            allowNew
          />
        </MyTagsWrapper>
        <Label htmlFor="deadline">deadline</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          ref={deadlineInputRef}
          rows="1"
          value={taskData.deadline}
          onChange={handleChangeDeadline}
        />
        <BoldText>priority</BoldText>
        <RadioButtonGroup id="priority" name="priority">
          <RadioButtonLabel htmlFor="priority-high">
            <Input
              id="priority-high"
              type="radio"
              name="priority"
              value="high"
              checked={taskData.priority === "high"}
              onChange={() => handleRadioButtonChange("high")}
              variant="priority-high"
            />
            high
          </RadioButtonLabel>
          <RadioButtonLabel htmlFor="priority-medium">
            <Input
              id="priority-medium"
              type="radio"
              name="priority"
              value="medium"
              checked={taskData.priority === "medium"}
              onChange={() => handleRadioButtonChange("medium")}
              variant="priority-medium"
            />
            medium
          </RadioButtonLabel>
          <RadioButtonLabel htmlFor="priority-low">
            <Input
              id="priority-low"
              type="radio"
              name="priority"
              value="low"
              checked={taskData.priority === "low"}
              onChange={() => handleRadioButtonChange("low")}
              variant="priority-low"
            />
            low
          </RadioButtonLabel>
        </RadioButtonGroup>
        <BoldText>image: </BoldText>
        {currentImageValue !== "" ||
        (taskData.image_url && taskData.image_url !== "") ? (
          <FileUploadContainer>
            <ChooseImageContainer>
              <FileInput
                type="file"
                id="image_upload"
                name="file"
                ref={fileInputRef}
                onChange={(event) => {
                  setCurrentImageValue(event.target.value);
                }}
              ></FileInput>
              <StyledIcon variant="small">
                <Icon labelText={"change image for upload"} />
              </StyledIcon>
            </ChooseImageContainer>
            <Button onClick={handleFileDelete} variant="small">
              <Icon labelText={"delete image"} />
            </Button>
          </FileUploadContainer>
        ) : (
          <FileUploadContainer>
            <ChooseImageContainer>
              <FileInput
                type="file"
                id="image_upload"
                name="file"
                ref={fileInputRef}
                onChange={(event) => {
                  setCurrentImageValue(event.target.value);
                }}
              ></FileInput>
              <StyledIcon variant="small">
                <Icon labelText={"choose image for upload"} />
              </StyledIcon>
            </ChooseImageContainer>
          </FileUploadContainer>
        )}

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
        <IconContainer variant="fixed">
          <StyledLink href={`/`} variant="medium" aria-hidden="true">
            <Icon labelText={"go to the previous page"} />
          </StyledLink>
          <Button type="submit" variant="big" aria-hidden="true">
            <Icon labelText={"save task details"} />
          </Button>
          <Button
            type="button"
            onClick={resetForm}
            variant="medium"
            aria-hidden="true"
          >
            <Icon labelText={"clear input form"} />
          </Button>
        </IconContainer>
      </FormContainer>
    </>
  );
}

// Styled components for the form layout
const FormContainer = styled.form`
  display: grid;
  grid-template-columns: auto;
  margin-bottom: 90px;
  gap: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const TitleInput = styled.textarea`
  padding: 1rem;
  font-size: inherit;
  border: none;
  border-radius: 1.5rem;
  background-color: var(--light-gray-background);
  flex: 1;
  margin-right: 0.5rem;

  height: auto;
  width: 100%;
  resize: none;
  overflow-y: hidden;

  ${({ variant }) =>
    variant === "big-data" &&
    css`
      min-height: 4.375rem;
    `};

  ::placeholder {
    white-space: pre-line;
    color: var(--light-gray-placeholder);
  }
  :focus {
    outline: none !important;
    box-shadow: 0 0 10px #a194fa;
    height: auto;
  }
`;

const SubtaskWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: inherit;
  border: none;
  min-width: 21.838rem;
  background-color: var(--light-gray-background);
  border-radius: 1.5rem;
  min-height: 5.563rem;
`;

const SubtaskInput = styled.textarea`
  position: absolute;
  padding: 1rem;
  padding-right: 1.5rem;
  font-size: inherit;
  border: none;
  border-radius: 1.5rem;
  background-color: var(--light-gray-background);
  flex: 1;
  margin-right: 0.5rem;
  min-width: 21.838rem;

  min-height: 5.563rem;
  resize: none;
  overflow-y: hidden;

  ::placeholder {
    white-space: pre-line;
    color: var(--light-gray-placeholder);
  }
  :focus {
    outline: none !important;
    box-shadow: 0 0 10px #a194fa;
    height: auto;
  }
`;

const DeleteSubtaskButton = styled(Button)`
  position: absolute;
  right: -0.2rem;
  bottom: -0.2rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 1rem;
  font-size: inherit;
  border: none;
  background-color: var(--light-gray-background);
  border-radius: 1.5rem;

  color: ${(props) =>
    props.value !== "" && props.value !== undefined && props.value
      ? "black"
      : " #878282"};
  :focus {
    outline: none !important;
    box-shadow: 0 0 10px #a194fa;
  }
  ::placeholder {
    white-space: pre-line;
    color: var(--light-gray-placeholder);
  }

  ${({ variant }) =>
    variant === "priority-high" &&
    css`
      margin-bottom: 0.3rem;
      :after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: white;
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
      }
      :checked:after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: var(--high-priority-card);
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
        outline: 5px solid #f6c6d8;
        box-shadow: 2px #f6c6d8;
      }
    `}
  ${({ variant }) =>
    variant === "priority-medium" &&
    css`
      margin-bottom: 0.3rem;
      :after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: white;
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
      }
      :checked:after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: var(--medium-priority-card);
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
        outline: 5px solid #cec7ff;
        box-shadow: 2px #cec7ff;
      }
    `}
    ${({ variant }) =>
    variant === "priority-low" &&
    css`
      margin-bottom: 0.3rem;
      :after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: white;
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
      }
      :checked:after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: -2px;
        left: -1px;
        position: relative;
        background-color: var(--low-priority-card);
        content: "";
        display: inline-block;
        visibility: visible;
        border: 0.2rem solid black;
        outline: 5px solid #a3ffb7;
        box-shadow: 2px #a3ffb7;
      }
    `}
`;

const RadioButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: black;
`;

const MyTagsWrapper = styled.div`
  .ReactTags__tagInputField {
    padding: 1rem;
    width: 100%;
    font-size: inherit;
    border: none;
    background-color: var(--light-gray-background);
    border-radius: 1.5rem;
    margin-top: 0.3rem;
    :focus {
      outline: none !important;
      box-shadow: 0 0 10px #a194fa;
    }
    ::placeholder {
      white-space: pre-line;
      color: var(--light-gray-placeholder);
    }
  }
  .ReactTags__remove {
    border-radius: 1.5rem;
    border: none;
    background-color: black;
    color: white;
    margin: 0.1rem;
  }
  .ReactTags__tag {
    display: inline-flex;
    justify-content: center;

    gap: 0.1rem;
    align-items: center;
    margin-right: 0.3rem;
    background-color: #cec7ff;
    border-radius: 1.5rem;
    padding: 0.3rem;
    padding-left: 0.7rem;
  }
`;

// Key codes for tags delimiters
const keyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

// Tags delimiters
const delimiters = [keyCodes.comma, keyCodes.enter, keyCodes.space];

const BoldText = styled.span`
  font-size: 0.9rem;
`;

const Textarea = styled.textarea`
  padding: 1rem;
  font-size: inherit;
  border: none;
  border-radius: 1.5rem;
  background-color: var(--light-gray-background);
  color: gray;
`;

const TaskImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const StyledIcon = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 2.5rem;
  width: 2.5rem;
  pointer-events: none;
  background-color: var(--black-color);
  border-radius: 1.5rem;
  ${({ variant }) =>
    variant === "small" &&
    css`
      height: var(--button-small);
      width: var(--button-small);
      svg {
        height: var(--icon-small);
        width: var(--icon-small);
      }
    `}
`;

const FileInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  opacity: 0;
  border: none;
  height: 2.5rem;
  width: 2.5rem;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FileUploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 4.4rem;
  width: 100%;
  height: 2.5rem;
`;

const ChooseImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 3rem;
  height: 2.5rem;
  width: 2.5rem;
`;
