import { useState } from "react";
import styled from "styled-components";
import { StyledButton } from "../StyledButton/StyledButton";

const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5 rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5 rem;
`;

const Label = styled.label`
  font-weight: bold;
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

const RadioButton = styled.input`
  margin-right: 0.5rem;
`;

export default function Form({ defaultData }) {
  const [selectedPrio, setSelectedPrio] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    // onSubmit(data);
  }

  function handleRadioButtonChange(prio) {
    setSelectedPrio(prio);
  }

  function resetForm() {
    setSelectedPrio("");
    document.getElementById("task-input-form").reset();
  }
  return (
    <FormContainer
      id="task-input-form"
      aria-labelledby="task-input-form"
      onSubmit={handleSubmit}
    >
      <Label htmlFor="title">title</Label>
      <Textarea
        id="name"
        name="name"
        type="text"
        defaultValue={defaultData?.name}
        rows="1"
      ></Textarea>
      <Label htmlFor="title">subtasks</Label>
      <Textarea
        id="subtasks"
        name="subtasks"
        type="text"
        defaultValue={defaultData?.subtasks}
        rows="5"
      ></Textarea>
      <Label htmlFor="title">category</Label>
      <Textarea
        id="category"
        name="category"
        type="text"
        defaultValue={defaultData?.category}
        rows="1"
      ></Textarea>
      <Label htmlFor="title">deadline</Label>
      <Input
        id="deadline"
        name="deadline"
        type="date"
        defaultValue={defaultData?.deadline}
        rows="1"
      ></Input>
      <RadioButtonGroup id="prioritisation">
        <RadioButtonLabel>
          <RadioButton
            type="radio"
            name="prioritisation"
            value="high"
            checked={selectedPrio === "high"}
            onChange={() => handleRadioButtonChange("high")}
          />
          high
        </RadioButtonLabel>
        <RadioButtonLabel>
          <RadioButton
            type="radio"
            name="prioritisation"
            value="mid"
            checked={selectedPrio === "mid"}
            onChange={() => handleRadioButtonChange("mid")}
          />
          mid
        </RadioButtonLabel>
        <RadioButtonLabel>
          <RadioButton
            type="radio"
            name="prioritisation"
            value="low"
            checked={selectedPrio === "low"}
            onChange={() => handleRadioButtonChange("low")}
          />
          low
        </RadioButtonLabel>
      </RadioButtonGroup>
      <StyledButton type="submit">{defaultData ? "edit" : "add"}</StyledButton>
      <StyledButton type="button" onClick={resetForm}>
        reset
      </StyledButton>
    </FormContainer>
  );
}
