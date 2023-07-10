import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import RegularTaskInputForm from "../components/RegularTaskInputForm";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { StyledContainer } from "../components/StyledContainer";
import Image from "next/image";
import { useState } from "react";

const headerText = "edit task";
const homeButtonShow = true;

// Mesagge for info banner
const BannerMessageSaved = () => <div>Task saved!</div>;

export default function TaskEditPage() {
  // State to check whether app is waiting for POST, GET, PATCH and DELETE responses
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const {
    data: existingTaskData,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/edit?id=${id}`);

  async function editTask(existingTaskData) {
    // While app is waiting for API response (pageIsLoading === true) user sees an animation
    setPageIsLoading(true);
    const response = await fetch(`/api/tasks/edit?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingTaskData),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/`);
    setPageIsLoading(false);
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

  if (pageIsLoading || error || isLoading)
    return (
      // Display loading UI when the task is being created
      <LoadingBackground>
        <LoadingContainer>
          <Gif
            src="/loading.gif"
            alt="circle loading gif"
            width={200}
            height={200}
          />
        </LoadingContainer>
      </LoadingBackground>
    );

  return (
    <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
      <StyledContainer>
        <EmptyDiv></EmptyDiv>
        <RegularTaskInputForm
          onSubmit={editTask}
          formName={"edit-task"}
          existingTaskData={existingTaskData}
          backLink={`/`}
        />
      </StyledContainer>
    </Layout>
  );
}

const EmptyDiv = styled.div`
  height: 25px;
`;

const LoadingBackground = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #1d1d1d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #1d1d1d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Gif = styled(Image)`
  border-radius: 100%;
`;
