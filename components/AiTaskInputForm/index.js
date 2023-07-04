import { useEffect, useRef, useState } from "react";
import { StyledButton } from "../StyledButton/StyledButton";
import styled from "styled-components";
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
          rows="21"
          required
          wrap="hard"
          maxLength={450}
          value={taskData.original_task_description}
          onChange={handleChangeTaskDescription}
          ref={original_task_descriptionInputRef}
          placeholder="e.g. plan a trip to Mallorca"
        />
        <ButtonsContainer>
          <NavigationLinkWrapper>
            <Link
              href={`/`}
              passHref
              legacyBehavior
              aria-label="go to the main page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="white"
                width="30px"
                height="30px"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
              stroke-width="1.5"
              stroke="white"
              width="40px"
              height="40px"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </Button>
          <Button type="button" onClick={resetForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              width="30px"
              height="30px"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
  margin-top: 63px;
  margin-bottom: 50px;
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
  :placeholder {
    white-space: pre-line;
  }
`;

const StyledErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: red;
  color: white;
`;
