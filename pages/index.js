import useSWR from "swr";
import styled from "styled-components";
import TaskPreviewCard from "../components/TaskPreviewCard";

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-left: 0;
  margin: 0;
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;

export default function TasksListPage() {
  const { data } = useSWR("/api/tasks", { fallbackData: [] });

  const sortedTasks = data.sort((taskA, taskB) => {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return priorityMap[taskB.priority] - priorityMap[taskA.priority];
  });

  if (!data) return <div>...loading</div>;

  return (
    <List role="list">
      {sortedTasks.map((task) => {
        return (
          <ListItem key={task._id}>
            <TaskPreviewCard
              title={task.title}
              tags={task.tags}
              deadline={task.deadline}
              priority={task.priority}
              id={task._id}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
