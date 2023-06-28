import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import styled from "styled-components";
import RegularTaskInputForm from "../../../components/RegularTaskInputForm";

export default function TaskEditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;
  const {
    data: existingTaskData,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/${dynamicId}`);

  async function editTask(existingTaskData) {
    const response = await fetch(`/api/tasks/${dynamicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingTaskData),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/tasks/${dynamicId}`);
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <RegularTaskInputForm
        onSubmit={editTask}
        formName={"edit-task"}
        existingTaskData={existingTaskData}
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
