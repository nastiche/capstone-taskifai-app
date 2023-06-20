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
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;

export default function TasksListPage() {
  const { data } = useSWR("/api/tasks", { fallbackData: [] });

  return (
    <List role="list">
      {data.map((task) => {
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

// US1 - TaskInputForm, tasks list with TaskCard:

// import useSWR from "swr";
// import Form from "../components/TaskInputForm";
// import styled from "styled-components";
// import TaskCard from "../components/TaskCard";

// const List = styled.ul`
//   list-style: none;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 1rem;
//   padding-left: 0;
// `;

// const ListItem = styled.li`
//   position: relative;
//   width: 100%;
// `;

// export default function CreateTaskPage() {
//   const { data, mutate } = useSWR("/api/tasks", { fallbackData: [] });

//   async function addTask(task) {
//     const response = await fetch("/api/tasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(task),
//     });
//     if (response.ok) {
//       mutate();
//     }
//   }
//   return (
//     <>
//       <Form onSubmit={addTask} formName={"add-task"}></Form>
//       <List role="list">
//         {data.map((task) => {
//           return (
//             <ListItem key={task._id}>
//               <TaskCard
//                 title={task.title}
//                 subtasks={task.subtasks}
//                 tags={task.tags}
//                 deadline={task.deadline}
//                 priority={task.priority}
//               />
//             </ListItem>
//           );
//         })}
//       </List>
//     </>
//   );
// }
