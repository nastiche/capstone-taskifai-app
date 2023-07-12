import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

test("renders a button with the correct variant", () => {
  render(<Button variant="big">Click me</Button>);

  const button = screen.getByRole("button");

  expect(button).toBeInTheDocument();
  expect(button).toHaveStyle(`
      height: var(--button-big);
      width: var(--button-big);
    `);
});

test("renders a button with the default variant if no variant is provided", () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole("button");

  expect(button).toBeInTheDocument();
});

test("applies the correct styles based on the variant", () => {
  render(<Button variant="small">Click me</Button>);

  const button = screen.getByRole("button");

  expect(button).toHaveStyle(`
    height: var(--button-small);
    width: var(--button-small);
  `);
});

test("applies the correct styles for different variants", () => {
  render(<Button variant="extra-small">Click me</Button>);

  const button = screen.getByRole("button");

  expect(button).toHaveStyle(`
    height: var(--button-extra-small);
    width: var(--button-extra-small);
  `);
});
