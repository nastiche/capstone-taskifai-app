import React, { useState } from "react";
import styled, { css } from "styled-components";
import { WithContext as ReactTags } from "react-tag-input";
import { StyledButton } from "../StyledButton/StyledButton";

const FormContainer = styled.form`
  display: grid;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: inherit;
  border: 3px solid black;
  border-radius: 0.5rem;
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

const MyTagsWrapper = styled.div`
  .ReactTags__tagInputField {
    width: 100%;
    border: 3px solid black;
    border-radius: 0.5rem;
  }
`;

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const BoldText = styled.span`
  font-weight: bold;
`;

export default function Form({ onSubmit, formName, defaultData }) {
  const [selectedPrio, setSelectedPrio] = useState("");
  const [tags, setTags] = useState([]);

  function handleTagDelete(index) {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }

  function handleTagAddition(tag) {
    const tagText = tag.text.trim();
    const isTagAlreadyAdded = tags.some(
      (existingTag) => existingTag.text.trim() === tagText
    );

    if (!isTagAlreadyAdded) {
      setTags((prevTags) => [
        ...prevTags,
        { id: String(prevTags.length + 1), text: tagText },
      ]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.subtasks = data.subtasks
      .split("\n")
      .map((subtask) => subtask.trim())
      .filter((subtask) => subtask !== "");
    data.tags = tags.map((tag) => tag.text);
    onSubmit(data);
    event.target.reset();
    setSelectedPrio("");
    setTags([]);
    event.target.elements.title.focus();
  }

  function handleRadioButtonChange(prio) {
    setSelectedPrio(prio);
  }

  function resetForm() {
    setSelectedPrio("");
    setTags([]);
    document.getElementById(formName).reset();
  }

  return (
    <FormContainer
      id={formName}
      aria-labelledby={formName}
      onSubmit={handleSubmit}
    >
      <Label htmlFor="title">title</Label>
      <Textarea
        id="title"
        name="title"
        type="text"
        defaultValue={defaultData?.name}
        rows="1"
        required
      ></Textarea>
      <Label htmlFor="subtasks">subtasks</Label>
      <Textarea
        id="subtasks"
        name="subtasks"
        defaultValue={defaultData?.subtasks}
        rows="5"
        placeholder={`Enter each subtask on a new line, e.g.

Clean the kitchen
Clean the bathroom`}

      ></Textarea>
      <Label htmlFor="tags">tags</Label>
      <MyTagsWrapper>
        <ReactTags
          id="tags"
          name="tags"
          tags={tags}
          handleDelete={handleTagDelete}
          handleAddition={handleTagAddition}
          delimiters={delimiters}
          placeholder="Press enter to add new tag"
          allowNew
        />
      </MyTagsWrapper>
      <Label htmlFor="deadline">deadline</Label>
      <Input
        id="deadline"
        name="deadline"
        type="date"
        defaultValue={defaultData?.deadline}
        rows="1"
      ></Input>
      <BoldText>priority</BoldText>
      <RadioButtonGroup id="priority" name="priority">
        <RadioButtonLabel htmlFor="priority-high">
          <RadioButton
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
          <RadioButton
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
          <RadioButton
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
      <StyledButton type="submit">{defaultData ? "edit" : "add"}</StyledButton>
      <StyledButton type="button" onClick={resetForm}>
        reset
      </StyledButton>
    </FormContainer>
  );
}
