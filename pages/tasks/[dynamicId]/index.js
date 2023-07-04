import { useRouter } from "next/router";
import useSWR from "swr";
import TaskDetails from "../../../components/TaskDetails";
import Link from "next/link";
import styled from "styled-components";
import { StyledButton } from "../../../components/StyledButton/StyledButton";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import { Button, ButtonsContainer } from "../../../components/Button/Button";
import { NavigationLinkWrapper } from "../../../components/NavigationLink/NavigationLink";

const headerText = "view task";
const homeButtonShow = true;

// Mesagge for info banner
const BannerMessage = () => <div>Task deleted!</div>;

export default function TaskDetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;

  const {
    data: task,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/${dynamicId}`);

  if (!isReady || isLoading || error)
    return <StyledLoadingDiv>...loading...</StyledLoadingDiv>;

  function handleEditLinkDivClick(event) {
    event.preventDefault();
    router.push(`/tasks/${dynamicId}/edit`);
  }

  async function deleteTask() {
    const response = await fetch(`/api/tasks/${dynamicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/`);

    // Info banner
    toast.success(<BannerMessage />, {
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
    <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
      <TaskDetails
        title={task.title}
        subtasks={task.subtasks}
        tags={task.tags}
        deadline={task.deadline}
        priority={task.priority}
        original_task_description={
          task.original_task_description ? task.original_task_description : null
        }
        image_url={task.image_url ? task.image_url : null}
      />
      <ButtonsContainer>
        <NavigationLinkWrapper>
          <Link href={`/`} passHref legacyBehavior aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              width="30px"
              height="30px"
              aria-label="go to the main page"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </Link>
        </NavigationLinkWrapper>
        <Button onClick={handleEditLinkDivClick} variant="positive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            width="40px"
            height="40px"
            aria-label="edit task"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </Button>
        <Button onClick={deleteTask}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            width="30px"
            height="30px"
            aria-label="delete task"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Button>
      </ButtonsContainer>
    </Layout>
  );
}

const BackLinkWrapper = styled.div`
  font-size: 3rem;
  a {
    text-decoration: none;
  }
`;

const StyledEditLinkDiv = styled.div`
  padding: 0.8rem;
  border-radius: 0.6rem;
  background-color: #f0f0f0;
  color: black;
  text-decoration: none;
  font-weight: 700;
  border: none;
  font-size: inherit;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: lightgray;
`;
