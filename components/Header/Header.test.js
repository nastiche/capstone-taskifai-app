import { render, screen } from "@testing-library/react";
import Header from "./index.js";

test("renders header with the correct text", () => {
  const headerText = "Hello, World!";
  render(<Header headerText={headerText} />);

  const headingElement = screen.getByText(headerText);
  expect(headingElement).toBeInTheDocument();
});

test("renders header with the specified font class", () => {
  const headerText = "Hello, World!";
  const fontClass = "custom-font";
  render(<Header headerText={headerText} font={fontClass} />);

  const headingElement = screen.getByText(headerText);
  expect(headingElement).toHaveClass(fontClass);
});
