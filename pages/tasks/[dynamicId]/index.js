import { useRouter } from "next/router";
import useSWR from "swr";
import TaskDetails from "../../../components/TaskDetails";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;

  const {
    data: task,
    isLoading,
    error,
  } = useSWR(`/api/tasks/${dynamicId}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <TaskDetails
      title={task.title}
      subtasks={task.subtasks}
      tags={task.tags}
      deadline={task.deadline}
      priority={task.priority}
    ></TaskDetails>
  );
}
