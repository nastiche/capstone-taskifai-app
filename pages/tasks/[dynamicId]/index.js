import { useRouter } from "next/router";
import useSWR from "swr";
import TaskDetails from "../../../components/TaskDetails";
import Link from "next/link";
import styled from "styled-components";
import { StyledButton } from "../../../components/StyledButton/StyledButton";

const LinkWrapper = styled.div`
  font-size: 3rem;
  a {
    text-decoration: none;
  }
`;

export default function TaskDetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;

  const { data: task, isLoading, error } = useSWR(`/api/tasks/${dynamicId}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <TaskDetails
        title={task.title}
        subtasks={task.subtasks}
        tags={task.tags}
        deadline={task.deadline}
        priority={task.priority}
      />
      <Link href={`/tasks/${dynamicId}/edit`} passHref legacyBehavior>
        <StyledButton>edit</StyledButton>
      </Link>
      <LinkWrapper>
        <Link href={`/`} passHref legacyBehavior aria-label="go back">
          <span aria-hidden="true">🔙</span>
        </Link>
      </LinkWrapper>
    </>
  );
}
