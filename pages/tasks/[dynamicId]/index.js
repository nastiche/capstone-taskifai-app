import { useRouter } from "next/router";
import useSWR from "swr";
import TaskDetails from "../../../components/TaskDetails";
import Link from "next/link";
import styled from "styled-components";
import { StyledButton } from "../../../components/StyledButton/StyledButton";
import { toast } from "react-toastify";

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
    <>
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

      <StyledEditLinkDiv onClick={handleEditLinkDivClick}>
        edit
      </StyledEditLinkDiv>
      <StyledButton onClick={deleteTask}>delete</StyledButton>
      <BackLinkWrapper>
        <Link href={`/`} passHref legacyBehavior aria-label="go back">
          <span aria-hidden="true">🔙</span>
        </Link>
      </BackLinkWrapper>
    </>
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
