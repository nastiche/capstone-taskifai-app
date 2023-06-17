import { render, screen } from "@testing-library/react";
import Header from ".";

test("renders the header with the correct text", () => {
  render(<Header />);
  const heading = screen.getByRole("heading", { name: /taskifAI/i });
  expect(heading).toBeInTheDocument();
});
