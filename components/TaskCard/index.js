import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";
import styled from "styled-components";
import { Button, ButtonsContainer } from "../Button/Button";
import Image from "next/image";
import { NavigationLinkWrapper } from "../NavigationLink/NavigationLink";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import css from "styled-jsx/css";

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

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
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

  return (
    <Article
      priorityVariant={priority}
      sizeVariant={taskDetailsDisplay ? "details" : "preview"}
    >
      <List>
        <ListItem>
          <TitleText>{title}</TitleText>
        </ListItem>
        <ListItem>
          <TagList>
            {tags.map((tag) => (
              <TagItem key={tag}>
                <TagText>{tag}</TagText>
              </TagItem>
            ))}
          </TagList>
        </ListItem>
        {deadline ? <ListItem>until {formattedDeadline}</ListItem> : null}
        <PriorityContainer priorityVariant={priority}>
          <BoldText>{priority !== "none" ? priority : null}</BoldText>
        </PriorityContainer>
      </List>

      <ButtonsContainer variant="absolute">
        <Button
          type="button"
          aria-hidden="true"
          onClick={() => {
            setTaskDetailsDisplay((prevState) => !prevState);
          }}
          variant="small"
        >
          {!taskDetailsDisplay ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              width="30px"
              height="30px"
              aria-label="show task details"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              width="30px"
              height="30px"
              aria-label="hide task details"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
              />
            </svg>
          )}
        </Button>
      </ButtonsContainer>

      {taskDetailsDisplay && (
        <>
          <ButtonsContainer variant="none">
            <NavigationLinkWrapper>
              <Link
                href={{ pathname: `/edit`, query: { id: id } }}
                passHref
                legacyBehavior
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  width="40px"
                  height="40px"
                  aria-label="edit task"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
            </NavigationLinkWrapper>
            <Button
              type="button"
              aria-hidden="true"
              onClick={() => {
                setTaskDetailsDisplay((prevState) => !prevState);
              }}
              variant="small"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                width="30px"
                height="30px"
                aria-label="hide task details"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                />
              </svg>
            </Button>
            <Button onClick={() => deleteTask(id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                width="30px"
                height="30px"
                aria-label="delete task"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Button>
          </ButtonsContainer>
          <List>
            {subtasks.length > 0 ? (
              <ListItem>
                <BoldText>subtasks: </BoldText>
                <List>
                  {subtasks.map((subtask) => (
                    <ListItem key={subtask.id}>
                      <SubtaskContainer>
                        <BulletPoint />
                        <SubtaskText>{subtask.value}</SubtaskText>
                      </SubtaskContainer>
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ) : null}
            {image_url && image_url !== "" ? (
              <ListItem>
                <BoldText>image: </BoldText>
                <TaskImage
                  alt="image"
                  src={image_url}
                  width="100"
                  height="100"
                />
              </ListItem>
            ) : null}
            {original_task_description !== "" ? (
              <ListItem>
                <BoldText>original task description: </BoldText>
                {original_task_description}
              </ListItem>
            ) : null}
          </List>
        </>
      )}
    </Article>
  );
}

// Styled components
const Article = styled.article`
  border-radius: 2.5rem;
  padding: 1.3rem;
  position: relative;
  border: none;

  max-width: 100%;

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
    `}

    ${({ sizeVariant }) =>
    sizeVariant === "preview" &&
    css`
      height: 12rem;
    `}

    ${({ sizeVariant }) =>
    sizeVariant === "details" &&
    css`
      min-height: 12rem;
    `}
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-left: 0;
`;

const ListItem = styled.li`
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
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: inline-block;
  max-width: 100%;
`;

const PriorityContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  width: 5rem;
  height: 2rem;
  top: 8.5rem;
  right: 1.3rem;

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
    `}
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
  justify-content: center;
  align-items: center;
  background-color: #eeeded;
  border-radius: 1rem;
  padding: 0.2rem 0.4rem;
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
`;

const SubtaskContainer = styled.div`
  display: flex;
  align-items: center;
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