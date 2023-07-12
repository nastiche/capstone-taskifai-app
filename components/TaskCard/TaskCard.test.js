import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./index.js";

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

describe("TaskCard", () => {
  test("clicking show details button toggles task details display", () => {
    const props = {
      id: 1,
      title: "Sample Task",
      subtasks: [],
      tags: [],
      deadline: "",
      priority: "none",
      original_task_description: "",
      image_url: "",
      onDelete: jest.fn(),
    };
    render(<TaskCard {...props} />);

    const showDetailsButton = screen.getByLabelText("show task details");
    fireEvent.click(showDetailsButton);

    const hideDetailsButton = screen.getByLabelText("hide task details");
    expect(hideDetailsButton).toBeInTheDocument();

    fireEvent.click(hideDetailsButton);

    const showDetailsButtonAgain = screen.getByLabelText("show task details");
    expect(showDetailsButtonAgain).toBeInTheDocument();
  });

  test("clicking show image button displays the image", () => {
    const props = {
      id: 1,
      title: "Sample Task",
      subtasks: [],
      tags: [],
      deadline: "",
      priority: "none",
      original_task_description: "",
      image_url: "image-url",
      onDelete: jest.fn(),
    };
    render(<TaskCard {...props} />);

    const showImageIcon = screen.getByLabelText("show image");
    fireEvent.click(showImageIcon);

    const taskImage = screen.getByAltText("image");
    expect(taskImage).toBeInTheDocument();

    const hideImageIcon = screen.getByLabelText("hide image");
    expect(hideImageIcon).toBeInTheDocument();
  });

  test("clicking confirm task deletion button triggers onDelete callback", () => {
    const onDeleteMock = jest.fn();
    const props = {
      id: 1,
      title: "Sample Task",
      subtasks: [],
      tags: [],
      deadline: "",
      priority: "none",
      original_task_description: "",
      image_url: "",
      onDelete: onDeleteMock,
    };
    render(<TaskCard {...props} />);

    const showDetailsButton = screen.getByLabelText("show task details");
    fireEvent.click(showDetailsButton);

    const deleteButton = screen.getByLabelText("delete task");
    fireEvent.click(deleteButton);

    const confirmDeletionButton = screen.getByLabelText(
      "confirm task deletion"
    );
    fireEvent.click(confirmDeletionButton);

    expect(onDeleteMock).toBeCalledWith(1);
  });

  test("clicking abort task deletion button cancels deletion mode", () => {
    const onDeleteMock = jest.fn();
    const props = {
      id: 1,
      title: "Sample Task",
      subtasks: [],
      tags: [],
      deadline: "",
      priority: "none",
      original_task_description: "",
      image_url: "",
      onDelete: onDeleteMock,
    };
    render(<TaskCard {...props} />);

    const showDetailsButton = screen.getByLabelText("show task details");
    fireEvent.click(showDetailsButton);

    const deleteButton = screen.getByLabelText("delete task");
    fireEvent.click(deleteButton);

    const abortDeletionButton = screen.getByLabelText("abort task deletion");
    fireEvent.click(abortDeletionButton);

    const confirmDeletionButton = screen.queryByLabelText(
      "confirm task deletion"
    );
    expect(confirmDeletionButton).not.toBeInTheDocument();
  });
});
