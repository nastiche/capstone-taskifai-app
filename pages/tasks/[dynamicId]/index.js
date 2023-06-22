import { useRouter } from "next/router";
import useSWR from "swr";
import TaskDetails from "../../../components/TaskDetails";
import Link from "next/link";
import styled from "styled-components";
import { StyledButton } from "../../../components/StyledButton/StyledButton";

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

export default function TaskDetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;

  const { data: task, isLoading, error } = useSWR(`/api/tasks/${dynamicId}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  function handleEditLinkDivClick(event) {
    event.preventDefault();
    router.push(`/tasks/${dynamicId}/edit`);
  }
  return (
    <>
      <TaskDetails
        title={task.title}
        subtasks={task.subtasks}
        tags={task.tags}
        deadline={task.deadline}
        priority={task.priority}
      />

      <StyledEditLinkDiv onClick={handleEditLinkDivClick}>
        edit
      </StyledEditLinkDiv>

      <BackLinkWrapper>
        <Link href={`/`} passHref legacyBehavior aria-label="go back">
          <span aria-hidden="true">🔙</span>
        </Link>
      </BackLinkWrapper>
    </>
  );
}
