import { render, screen, fireEvent } from "@testing-library/react";
import AiTaskInputForm from ".";

test("allows user to type in the task description field", () => {
  render(<AiTaskInputForm onSubmit={() => {}} formName="testForm" />);

  const taskDescriptionTextarea = screen.getByRole("textbox", {
    name: /task description/i,
  });

  fireEvent.change(taskDescriptionTextarea, {
    target: { value: "Plan a trip to Mallorca" },
  });

  expect(taskDescriptionTextarea).toHaveValue("Plan a trip to Mallorca");
});
