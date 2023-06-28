import { useEffect, useRef, useState } from "react";
import { StyledButton } from "../StyledButton/StyledButton";
import styled from "styled-components";

// Task data for initial state
const initialTaskData = { original_task_description: "" };

export default function AiTaskInputForm({ onSubmit, formName, aiQuery }) {
  // Reference for original_task_description form input field
  const original_task_descriptionInputRef = useRef(null);

  // State for form input field value
  const [taskData, setTaskData] = useState(initialTaskData);

  // Focusing on original_task_description input field on page load
  useEffect(() => {
    original_task_descriptionInputRef.current.focus();
  }, []);

  // Hook used to check whether the input form gets the prop aiQuery
  // (aiQuery comes in when AI gives bad response back)
  useEffect(() => {
    // Set taskData to user's query if AI gave a bad response back.
    // In this case the user gets a chance to edit the query and send the post request to AI again
    if (aiQuery) {
      setTaskData(aiQuery);
    }
  }, [aiQuery]);

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
        rows="17"
        required
        wrap="hard"
        maxLength={500}
        value={taskData.original_task_description}
        onChange={handleChangeTaskDescription}
        ref={original_task_descriptionInputRef}
      />
      <StyledButton type="submit">create</StyledButton>
      <StyledButton type="button" onClick={resetForm}>
        reset
      </StyledButton>
    </FormContainer>
  );
}

// Styled components for the form layout
const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 700;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
`;
