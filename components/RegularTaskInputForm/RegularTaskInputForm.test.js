import { render, screen } from "@testing-library/react";
import RegularTaskInputForm from ".";

test("renders the title input field", () => {
  render(<RegularTaskInputForm />);
  const titleInput = screen.getByLabelText("title");
  expect(titleInput).toBeInTheDocument();
});

test("renders the tags input field", () => {
  render(<RegularTaskInputForm />);
  const tagsInput = screen.getByLabelText("tags");
  expect(tagsInput).toBeInTheDocument();
});

test("renders the deadline input field", () => {
  render(<RegularTaskInputForm />);
  const deadlineInput = screen.getByLabelText("deadline");
  expect(deadlineInput).toBeInTheDocument();
});

test("renders the priority radio buttons", () => {
  render(<RegularTaskInputForm />);
  const highPriorityRadioButton = screen.getByLabelText("high");
  const mediumPriorityRadioButton = screen.getByLabelText("medium");
  const lowPriorityRadioButton = screen.getByLabelText("low");
  expect(highPriorityRadioButton).toBeInTheDocument();
  expect(mediumPriorityRadioButton).toBeInTheDocument();
  expect(lowPriorityRadioButton).toBeInTheDocument();
});

test("renders the image upload section", () => {
  render(<RegularTaskInputForm />);
  const chooseImageButton = screen.getByLabelText("choose image for upload");
  expect(chooseImageButton).toBeInTheDocument();
});
