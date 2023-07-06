import useSWR from "swr";
import styled from "styled-components";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Layout from "../components/Layout";
import {
  NavigationLinkWrapper,
  NavigationLinksContainer,
} from "../components/NavigationLink/NavigationLink";
import Link from "next/link";

const headerText = "taskifAI";
const homeButtonShow = false;

export default function TasksListPage() {
  // Fetch task data using useSWR hook
  const { data, isLoading } = useSWR("/api/tasks", { fallbackData: [] });

  // State variables
  const [sortedTasks, setSortedTasks] = useState([]); // Array to store sorted tasks
  const [sortType, setSortType] = useLocalStorageState(
    "sortType",
    "creation_date"
  ); // Sort type state with local storage persistence
  const [sortDirection, setSortDirection] = useLocalStorageState(
    "sort direction",
    "asc"
  ); // Sort direction state

  // Function to convert priority string to a corresponding number
  const priorityToNumber = (priority) => {
    switch (priority) {
      case "low":
        return 1;
      case "medium":
        return 2;
      case "high":
        return 3;
      default:
        return 0;
    }
  };

  // Function to toggle the sort direction between ascending and descending
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    // Sorting logic based on the selected sort type
    const sortArray = (type) => {
      const types = {
        deadline: "deadline",
        creation_date: "creation_date",
        edit_date: "edit_date",
        priority: "priority",
      };
      const sortProperty = types[type];
      if (data.length > 0) {
        const sorted = [...data].sort((a, b) => {
          // Sort based on the sort property
          if (sortProperty === "deadline") {
            return new Date(a[sortProperty]) - new Date(b[sortProperty]);
          } else if (sortProperty === "creation_date") {
            return new Date(b[sortProperty]) - new Date(a[sortProperty]);
          } else if (sortProperty === "edit_date") {
            return new Date(b[sortProperty]) - new Date(a[sortProperty]);
          } else if (sortProperty === "priority") {
            return (
              priorityToNumber(a[sortProperty]) -
              priorityToNumber(b[sortProperty])
            );
          }
          return 0;
        });

        const sortedWithDirection =
          sortDirection === "asc" ? sorted : sorted.reverse();

        setSortedTasks(sortedWithDirection);
      }
    };

    sortArray(sortType);
  }, [sortType, sortDirection, data]);

  if (isLoading) {
    return <StyledLoadingDiv>...loading...</StyledLoadingDiv>;
  } else {
    return (
      <>
        <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
          <StyledWrapper>
            <BoldText></BoldText>
            {/* Select input for choosing the sort type */}
            <StyledSelect
              onChange={(event) => setSortType(event.target.value)}
              value={sortType}
            >
              <option value="deadline">sort by deadline</option>
              <option value="priority">sort by priority</option>
              <option value="creation_date">sort by creation date</option>
              <option value="edit_date_date">sort by edit date</option>
            </StyledSelect>
            {/* Button to toggle the sort direction */}
            <StyledButton onClick={toggleSortDirection} value={sortDirection}>
              {sortDirection === "asc" ? (
                <span aria-label="ascendent sort direction">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="black"
                    height="1rem"
                    width="1rem"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                    />
                  </svg>
                </span>
              ) : (
                <span aria-label="descendent sort direction">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="black"
                    height="1rem"
                    width="1rem"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                    />
                  </svg>
                </span>
              )}
            </StyledButton>
          </StyledWrapper>
          <TasksList role="list">
            {/* Render task preview cards for each sorted task */}
            {sortedTasks.map((task) => {
              return (
                <ListItem key={task._id}>
                  <TaskCard
                    title={task.title}
                    tags={task.tags}
                    deadline={task.deadline}
                    priority={task.priority}
                    id={task._id}
                    subtasks={task.subtasks}
                    original_task_description={task.original_task_description}
                    image_url={task.image_url}
                  />
                </ListItem>
              );
            })}
          </TasksList>
          <NavigationLinksContainer>
            <NavigationLinkWrapper variant="positive">
              <Link href={`/create`} passHref legacyBehavior aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  width="30px"
                  height="30px"
                  aria-label="go to the main page"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Link>
            </NavigationLinkWrapper>
          </NavigationLinksContainer>
        </Layout>
      </>
    );
  }
}

// Styled components for styling
const TasksList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding-left: 0;
  margin-bottom: 110px;
  margin-top: 70px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: lightgray;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  position: fixed;
  top: 3;
  z-index: 1;
  height: 60px;
  padding-top: 25px;
  background-color: white;
  width: 100%;
  padding-bottom: 3px;
  justify-content: space-between;
`;

const StyledSelect = styled.select`
  padding: 0.5;
  border-radius: 4px;
  border: none;
  background-color: #eeeded;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 1.5rem;
  padding: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-weight: 700;
`;

const StyledButton = styled.button`
  padding: 1rem;
  border-radius: 4px;
  border: none;
  background-color: #eeeded;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
`;

const BoldText = styled.span`
  font-weight: 700;
`;
