import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { StyledLink } from "../NavigationLink/NavigationLink";
import { IconContainer } from "../IconContainer";

// Task data for initial state
const initialTaskData = {
  title: "",
  subtasks: [],
  tags: [],
  deadline: "",
  priority: "",
  original_task_description: "",
};

export default function AiTaskInputForm({ onSubmit, formName, newAiTaskData }) {
  // Reference for original_task_description form input field
  const original_task_descriptionInputRef = useRef(null);

  // State for form input field's value
  const [taskData, setTaskData] = useState(initialTaskData);

  // Focusing on original_task_description input field on page load
  useEffect(() => {
    original_task_descriptionInputRef.current.focus();
  }, []);

  // Hook used to check whether the input form gets the prop newAiTaskData
  // (newAiTaskData comes in when AI gives bad response back)
  useEffect(() => {
    // Set taskData to incoming newAiTaskData (is comes with original task description in it which is user's query).
    // In this case the user gets a chance to edit the query and send the post request to AI again
    if (newAiTaskData) {
      setTaskData(newAiTaskData);
    }
  }, [newAiTaskData]);

  // Handle original_task_description field change
  function handleChangeTaskDescription(event) {
    const { name, value } = event.target;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTaskData = Object.fromEntries(formData);

    // Reset form
    setTaskData(initialTaskData);

    // Submit form data
    onSubmit(newTaskData);
  }

  // Resets the form to initial state (function for reset button)
  function resetForm() {
    setTaskData(initialTaskData);
    original_task_descriptionInputRef.current.focus();
  }
  return (
    <>
      <FormContainer
        id={formName}
        aria-labelledby={formName}
        onSubmit={handleSubmit}
      >
        <Label htmlFor="original_task_description">task description</Label>
        <Textarea
          id="original_task_description"
          name="original_task_description"
          type="text"
          rows="20"
          required
          wrap="hard"
          maxLength={400}
          value={taskData.original_task_description}
          onChange={handleChangeTaskDescription}
          ref={original_task_descriptionInputRef}
          placeholder="e.g. plan a trip to Mallorca"
          data-testid="original-task-description"
        />
        <IconContainer variant="fixed">
          <StyledLink href={`/`} aria-hidden="true" variant="medium">
            <Icon labelText={"go to the previous page"} />
          </StyledLink>
          <Button
            type="submit"
            aria-hidden="true"
            variant="big"
            name="let_ai_create_task_details"
            data-testid="submit-button"
          >
            <Icon labelText={"let AI create task details"} />
          </Button>
          <Button
            type="button"
            onClick={resetForm}
            aria-hidden="true"
            variant="medium"
            name="clear_input_form"
            id="clear_input_form"
            data-testid="clear-button"
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
  margin-bottom: 50px;
  gap: 0.5rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
`;

const Textarea = styled.textarea`
  font-size: inherit;
  padding: 1rem;
  border: none;
  background-color: var(--light-gray-background);
  border-radius: 1.5rem;
  ::placeholder {
    white-space: pre-line;
    color: var(--light-gray-placeholder);
  }

  :focus {
    outline: none !important;
    box-shadow: 0 0 10px #a194fa;
  }
`;
