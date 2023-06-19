import React, { useState } from "react";
import styled from "styled-components";
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

const TagEditor = styled(ReactTags)`
  width: 100%;

  .react-tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .react-tags__tag {
    display: flex;
    align-items: center;
    background-color: #e4e6eb;
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.875rem;
  }

  .react-tags__tag-content {
    margin-right: 0.5rem;
  }

  .react-tags__remove {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  .react-tags__remove:hover {
    color: #f44336;
  }
`;

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

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
    data.subtasks = data.subtasks.split("\n").map((subtask) => subtask.trim());
    data.tags = tags.map((tag) => tag.text);
    onSubmit(data);
    event.target.reset();
    event.target.elements.title.focus();
    console.log(data);
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
      <TagEditor
        id="tags"
        name="tags"
        tags={tags}
        handleDelete={handleTagDelete}
        handleAddition={handleTagAddition}
        delimiters={delimiters}
        placeholder="Press enter to add new tag"
        allowNew
      />

      <Label htmlFor="deadline">deadline</Label>
      <Input
        id="deadline"
        name="deadline"
        type="date"
        defaultValue={defaultData?.deadline}
        rows="1"
      ></Input>

      <Label htmlFor="priority">priority</Label>
      <RadioButtonGroup id="priority" name="priority">
        <RadioButtonLabel>
          <RadioButton
            type="radio"
            name="priority"
            value="high"
            checked={selectedPrio === "high"}
            onChange={() => handleRadioButtonChange("high")}
          />
          high
        </RadioButtonLabel>
        <RadioButtonLabel>
          <RadioButton
            type="radio"
            name="priority"
            value="medium"
            checked={selectedPrio === "medium"}
            onChange={() => handleRadioButtonChange("medium")}
          />
          medium
        </RadioButtonLabel>
        <RadioButtonLabel>
          <RadioButton
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
