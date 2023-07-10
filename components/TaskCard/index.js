import useSWR from "swr";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import Image from "next/image";
import { StyledLink } from "../NavigationLink/NavigationLink";
import { toast } from "react-toastify";
import css from "styled-jsx/css";
import { IconContainer } from "../IconContainer";
import { Icon } from "../Icon";

export default function TaskCard({
  id,
  title,
  subtasks,
  tags,
  deadline,
  priority,
  original_task_description,
  image_url,
  onDelete,
}) {
  const [taskDetailsDisplay, setTaskDetailsDisplay] = useState(false);

  const [showImage, setShowImage] = useState(false);

  const [showOriginalTaskDescription, setShowOriginalTaskDescription] =
    useState(false);

  const [deleteTaskMode, setDeleteTaskMode] = useState(false);

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    : "";

  if (showImage) {
    return (
      <ModalBackground>
        <ImageButtonContainer>
          <TaskImageFull alt="image" src={image_url} width="300" height="300" />
          <ShrinkImageButton
            onClick={() => setShowImage(false)}
            variant="extra-small"
          >
            <Icon labelText={"hide image"} />
          </ShrinkImageButton>
        </ImageButtonContainer>
      </ModalBackground>
    );
  } else if (deleteTaskMode) {
    return (
      <>
        <ModalBackground>
          <DeleteTaskModal>
            <ModalText>delete task?</ModalText>
          </DeleteTaskModal>
          <DeleteTaskIconsContainer>
            <StyledButton variant="medium" onClick={() => onDelete(id)}>
              <Icon labelText={"confirm task deletion"} />
            </StyledButton>
            <StyledButton
              variant="medium"
              onClick={() => setDeleteTaskMode(false)}
            >
              <Icon labelText={"abort task deletion"} />
            </StyledButton>
          </DeleteTaskIconsContainer>
        </ModalBackground>
      </>
    );
  } else {
    return (
      <TaskCardContainer
        priorityVariant={priority}
        sizeVariant={taskDetailsDisplay ? "details" : "preview"}
        className="task-card-container"
      >
        <TaskPreviewContainer sizeVariant="preview">
          <TitleContainer>
            <TitleText>{title}</TitleText>
          </TitleContainer>
          {deadline ? (
            <DeadlineContainer>
              <DeadlineText>until {formattedDeadline}</DeadlineText>
            </DeadlineContainer>
          ) : null}
          <TagsContainer>
            <TagList>
              {tags.map((tag) => (
                <TagItem key={tag}>
                  <TagText>{tag}</TagText>
                </TagItem>
              ))}
            </TagList>
          </TagsContainer>
          <PriorityContainer priorityVariant={priority}>
            {priority !== "none" ? priority : null}
          </PriorityContainer>
          {!taskDetailsDisplay ? (
            <IconContainer variant="absolute">
              <Button
                type="button"
                aria-hidden="true"
                onClick={() => {
                  setTaskDetailsDisplay(true);
                }}
                variant="small"
              >
                <Icon labelText={"show task details"} />
              </Button>
            </IconContainer>
          ) : null}
        </TaskPreviewContainer>
        <TaskDetailsContainerWrap
          variant={taskDetailsDisplay ? "details" : "preview"}
        >
          <TaskDetailsContainer
            variant={taskDetailsDisplay ? "details" : "preview"}
          >
            {subtasks.length > 0 ? (
              <>
                <BoldText>subtasks: </BoldText>
                <SubtasksContainer>
                  {subtasks.map((subtask) => (
                    <SubtaskContainer key={subtask.id}>
                      <SubtaskText>{subtask.value}</SubtaskText>
                    </SubtaskContainer>
                  ))}
                </SubtasksContainer>
              </>
            ) : null}

            {image_url && image_url !== "" ? (
              <>
                <BoldText>image: </BoldText>
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
              </>
            ) : null}

            {original_task_description !== "" ? (
              <>
                <BoldText>original task description: </BoldText>

                <OriginalTaskDescriptionContainer>
                  <OriginalTaskDescriptionText>
                    {original_task_description}
                  </OriginalTaskDescriptionText>
                </OriginalTaskDescriptionContainer>
              </>
            ) : null}
          </TaskDetailsContainer>
        </TaskDetailsContainerWrap>
        {taskDetailsDisplay ? (
          <DetailsIconContainer variant="absolute">
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
                setTaskDetailsDisplay(false);
                setShowOriginalTaskDescription(false);
              }}
              variant="small"
            >
              <Icon labelText={"hide task details"} />
            </Button>
            <Button
              onClick={() => setDeleteTaskMode(true)}
              variant="medium"
              aria-hidden="true"
            >
              <Icon labelText={"delete task"} />
            </Button>
          </DetailsIconContainer>
        ) : null}
      </TaskCardContainer>
    );
  }
}

// Styled components

const BoldText = styled.span`
  font-weight: 700;
  white-space: normal;
`;

const TaskCardContainer = styled.div`
  border-radius: 1.5rem;
  padding: 1rem;
  border: none;
  width: 100%;

  ${({ sizeVariant }) =>
    sizeVariant === "details" &&
    css`
      padding-bottom: 2.3rem;
    `};
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
  min-height: 10rem;
`;

const TaskDetailsContainerWrap = styled.div`
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s;

  ${({ variant }) =>
    variant === "details" &&
    css`
      grid-template-rows: 1fr;
    `};
`;

const TaskDetailsContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const DetailsIconContainer = styled(IconContainer)`
  bottom: -1.6rem;
`;

const TitleContainer = styled.div`
  width: 100%;
  min-height: 4rem;
  margin-bottom: 1rem;
`;

const TitleText = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: inline-block;
  max-width: 100%;
`;

const DeadlineContainer = styled.div`
  width: 100%;
`;

const DeadlineText = styled.span`
  color: gray;
`;

const TagsContainer = styled.div`
  position: absolute;
  top: 7.2rem;
  left: 0;
  width: 100%;
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

const PriorityContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  width: 5.5rem;
  height: 2.2rem;
  top: 4.5rem;
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

const SubtasksContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  background: white;
  border-radius: 1rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const SubtaskContainer = styled.div`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 1rem;
  background: var(--light-gray-background);
  width: 100%;
  padding: 0.5rem;
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const ImageButtonContainer = styled.div`
  position: relative;
`;

const TaskImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
`;

const TaskImageFull = styled(Image)`
  width: 100vw; /* Set the width to the full viewport width */
  height: 100vh; /* Set the height to the full viewport height */
  object-fit: contain; /* Preserve the aspect ratio of the image while fitting it within the container */
  border-radius: 0; /* Remove the border radius */
`;

const ExpandImageButton = styled(Button)`
  position: absolute;
  right: -0.6rem;
  top: -0.6rem;
`;

const ShrinkImageButton = styled(Button)`
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
  border: 1.5px solid white;
`;
const ModalBackground = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: var(--black-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const DeleteTaskModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  height: 7rem;
  width: 17rem;

  background-color: #cec7ff;
`;

const StyledButton = styled(Button)`
  border: 1.5px solid white;
`;

const ModalText = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
`;

const DeleteTaskIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  gap: 3.5rem;
  margin-top: 1rem;
  margin-bottom: 5rem;
  width: 17rem;
  height: 3rem;
`;

const OriginalTaskDescriptionHiddenContainer = styled.div`
  position: relative;
  border: none;
  height: 0.3rem;
  width: 100%;
  background: var(--light-gray-background);
  border-radius: 5rem;
  margin-top: 0.5rem;
`;

const ShowOriginalTaskDescriptionButton = styled(Button)`
  position: absolute;
  bottom: -2.2rem;
  left: 50%;
  transform: translateX(-50%);
`;

const HideOriginalTaskDescriptionButton = styled(Button)`
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
`;

const OriginalTaskDescriptionContainer = styled.div`
  border: none;
  border-radius: 1.5rem;
  background: var(--light-gray-background);
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
`;
const OriginalTaskDescriptionText = styled.span`
  font-size: 0.9rem;
  color: var(--black-color);
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: inline-block;
`;
