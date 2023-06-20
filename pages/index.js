import useSWR from "swr";
import styled from "styled-components";
import TaskCard from "../components/TaskCard";

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

  return (
    <List role="list">
      {sortedTasks.map((task) => {
        return (
          <ListItem key={task._id}>
            <TaskCard
              title={task.title}
              subtasks={task.subtasks}
              tags={task.tags}
              deadline={task.deadline}
              priority={task.priority}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
