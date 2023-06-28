import useSWR from "swr";
import styled from "styled-components";
import TaskPreviewCard from "../components/TaskPreviewCard";

export default function TasksListPage() {
  const { data } = useSWR("/api/tasks", { fallbackData: [] });

  const sortedTasks = data.sort((taskA, taskB) => {
    const dateA = new Date(taskA.creation_date);
    const dateB = new Date(taskB.creation_date);

    return dateB - dateA;
  });

  if (!data) {
    return <StyledLoadingDiv>...loading...</StyledLoadingDiv>;
  } else {
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
}

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

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: green;
`;
