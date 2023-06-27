import { useRouter } from "next/router";
import useSWR from "swr";
import Form from "../../../components/TaskInputForm";
import Link from "next/link";
import styled from "styled-components";

export default function TaskEditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;
  const {
    data: task,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/${dynamicId}`);

  async function editTask(task) {
    const response = await fetch(`/api/tasks/${dynamicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/tasks/${dynamicId}`);
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <Form
        onSubmit={editTask}
        formName={"edit-task"}
        existingTaskData={task}
      />
      <LinkWrapper>
        <Link href={`/`} passHref legacyBehavior aria-label="go back">
          <span aria-hidden="true">🔙</span>
        </Link>
      </LinkWrapper>
    </>
  );
}

const LinkWrapper = styled.div`
  font-size: 3rem;
  a {
    text-decoration: none;
  }
`;
