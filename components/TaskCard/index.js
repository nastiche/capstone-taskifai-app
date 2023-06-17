import styled from "styled-components";

const Article = styled.article`
  border: 3px solid black;
  border-radius: 0.8rem;
  padding: 0.5rem;
`;

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

const BoldText = styled.span`
  font-weight: bold;
`;

export default function TaskCard({
  title,
  category,
  deadline,
  prioritisation,
}) {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : "";
  return (
    <Article>
      <List>
        <ListItem>
          task: <BoldText>{title}</BoldText>
        </ListItem>
        <ListItem>
          category: <BoldText>{category}</BoldText>
        </ListItem>
        <ListItem>
          deadline:<BoldText> {formattedDeadline}</BoldText>
        </ListItem>
        <ListItem>
          priority:<BoldText> {prioritisation}</BoldText>
        </ListItem>
      </List>
    </Article>
  );
}
