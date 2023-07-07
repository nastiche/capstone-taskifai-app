import useSWR from "swr";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import Image from "next/image";
import { StyledLink } from "../NavigationLink/NavigationLink";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import css from "styled-jsx/css";
import { IconContainer } from "../IconContainer";
import { Icon } from "../Icon";

// Mesagge for info banner
const BannerMessageSaved = () => <div>Task deleted!</div>;

export default function TaskCard({
  id,
  title,
  subtasks,
  tags,
  deadline,
  priority,
  original_task_description,
  image_url,
}) {
  const router = useRouter();
  console.log(
    id,
    title,
    subtasks,
    tags,
    deadline,
    priority,
    original_task_description,
    image_url
  );
  const { mutate } = useSWR(`/api/tasks`);

  const [taskDetailsDisplay, setTaskDetailsDisplay] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    : "";

  async function deleteTask(id) {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/`);

    // Info banner
    toast.success(<BannerMessageSaved />, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return showImage ? (
    <ShowImageContainer>
      <ImageButtonContainer>
        <TaskImage alt="image" src={image_url} width="300" height="300" />
        <ExpandImageButton
          onClick={() => setShowImage(false)}
          variant="extra-small"
        >
          <Icon labelText={"hide image"} />
        </ExpandImageButton>
      </ImageButtonContainer>
    </ShowImageContainer>
  ) : (
    <>
      {" "}
      <TaskCardContainer priorityVariant={priority}>
        <TaskPreviewContainer sizeVariant="preview">
          <TitleContainer>
            <TitleText>{title}</TitleText>
          </TitleContainer>
          <TagsContainer>
            <TagList>
              {tags.map((tag) => (
                <TagItem key={tag}>
                  <TagText>#{tag}</TagText>
                </TagItem>
              ))}
            </TagList>
          </TagsContainer>
          {deadline ? (
            <DeadlineContainer>
              <DeadlineText>until {formattedDeadline}</DeadlineText>
            </DeadlineContainer>
          ) : null}
          <PriorityContainer priorityVariant={priority}>
            {priority !== "none" ? priority : null}
          </PriorityContainer>
          {!taskDetailsDisplay ? (
            <IconContainer variant="absolute">
              <Button
                type="button"
                aria-hidden="true"
                onClick={() => {
                  setTaskDetailsDisplay((prevState) => !prevState);
                }}
                variant="small"
              >
                <Icon labelText={"show task details"} />
              </Button>
            </IconContainer>
          ) : null}
        </TaskPreviewContainer>
        {taskDetailsDisplay ? (
          <>
            <TaskDetailsContainer>
              <BoldText>subtasks: </BoldText>
              {subtasks.length > 0 ? (
                <SubtasksContainer>
                  {subtasks.map((subtask) => (
                    <SubtaskContainer key={subtask.id}>
                      <SubtaskText>{subtask.value}</SubtaskText>
                    </SubtaskContainer>
                  ))}
                </SubtasksContainer>
              ) : null}
              <BoldText>image: </BoldText>
              {image_url && image_url !== "" ? (
                <ImageContainer>
                  <ImageButtonContainer>
                    <TaskImage
                      alt="image"
                      src={image_url}
                      width="100"
                      height="100"
                    />
                    <ExpandImageButton
                      onClick={() => setShowImage(true)}
                      variant="extra-small"
                    >
                      <Icon labelText={"show image"} />
                    </ExpandImageButton>
                  </ImageButtonContainer>
                </ImageContainer>
              ) : null}
              {original_task_description !== "" ? (
                <OriginalTaskDescriptionContainer>
                  <BoldText>original task description: </BoldText>
                  {original_task_description}
                </OriginalTaskDescriptionContainer>
              ) : null}{" "}
              <IconContainer variant="absolute">
                <StyledLink
                  href={{ pathname: `/edit`, query: { id: id } }}
                  variant="medium"
                  aria-hidden="true"
                >
                  <Icon labelText={"go to the task edit page"} />
                </StyledLink>
                <Button
                  type="button"
                  aria-hidden="true"
                  onClick={() => {
                    setTaskDetailsDisplay((prevState) => !prevState);
                  }}
                  variant="small"
                >
                  <Icon labelText={"hide task details"} />
                </Button>
                <Button
                  onClick={() => deleteTask(id)}
                  variant="medium"
                  aria-hidden="true"
                >
                  <Icon labelText={"delete task"} />
                </Button>
              </IconContainer>
            </TaskDetailsContainer>
          </>
        ) : null}
      </TaskCardContainer>
    </>
  );
}

// Styled components
const TaskCardContainer = styled.div`
  position: relative;
  border-radius: 1.5rem;
  padding: 1rem;
  border: none;
  width: 22.5rem;
  ${({ priorityVariant }) =>
    priorityVariant === "low" &&
    css`
      background-color: var(--low-priority-card);
    `}
  ${({ priorityVariant }) =>
    priorityVariant === "medium" &&
    css`
      background-color: var(--medium-priority-card);
    `}
    ${({ priorityVariant }) =>
    priorityVariant === "high" &&
    css`
      background-color: var(--high-priority-card);
    `}
    ${({ priorityVariant }) =>
    priorityVariant === "none" &&
    css`
      background-color: var(--no-priority-card);
    `};
`;

const TaskPreviewContainer = styled.div`
  position: relative;
  height: 10rem;
`;

const TaskDetailsContainer = styled.div`
  position: relative;
  margin-top: 0.2rem;
  padding-bottom: 2rem;
`;

const TitleContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;

const TagsContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0.7rem;
  left: 0;
`;

const PriorityContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  width: 5.5rem;
  height: 2.2rem;
  bottom: 3.3rem;
  right: 0;
  color: white;
  ${({ priorityVariant }) =>
    priorityVariant === "low" &&
    css`
      background-color: var(--low-priority-icon);
    `}
  ${({ priorityVariant }) =>
    priorityVariant === "medium" &&
    css`
      background-color: var(--medium-priority-icon);
    `}
    ${({ priorityVariant }) =>
    priorityVariant === "high" &&
    css`
      background-color: var(--high-priority-icon);
    `};
`;

const DeadlineContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 5rem;
  left: 0;
`;

const SubtasksContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  background: white;
  border-radius: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.7rem;
  margin-top: 0.3rem;
`;

const SubtaskContainer = styled.div`
  border: none;
  border-radius: 1rem;
  background: var(--light-gray-background);
  width: 100%;
  padding: 0.5rem;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.3rem;
`;

const ImageButtonContainer = styled.div`
  position: relative;
`;

const OriginalTaskDescriptionContainer = styled.div`
  width: 100%;
`;

const BoldText = styled.span`
  font-weight: 700;
  white-space: normal;
`;

const TitleText = styled.span`
  font-weight: 700;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: inline-block;
  max-width: 100%;
`;

const SubtaskText = styled.span`
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: inline-block;
`;

const DeadlineText = styled.span`
  color: gray;
`;

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  gap: 0.5rem;
  padding: 0;
`;

const TagItem = styled.li`
  display: flex;
  height: 2rem;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 1rem;
  padding: 0.4rem 0.6rem;
  white-space: normal;
`;

const TagText = styled.span`
  white-space: normal;
  font-size: 0.9rem;
`;

// Styled components for Task Details

const TaskImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
`;

const BulletPoint = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
`;

const ExpandImageButton = styled(Button)`
  position: absolute;
  right: -0.6rem;
  top: -0.6rem;
`;

const ShowImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: var(--light-gray-background);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure the container appears above other elements */
`;
