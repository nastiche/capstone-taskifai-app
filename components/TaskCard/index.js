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
  font-weight: 700;
  white-space: normal;
`;

const TagList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
`;

const TagItem = styled.li`
  background-color: lightgray;
  border-radius: 0.3rem;
  padding: 0.3rem 0.5rem;
  white-space: normal;
`;

const BulletPoint = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
`;

const SubtaskContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SubtaskText = styled.span`
  margin-left: 8px;
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
`;

const TagText = styled.span`
  white-space: normal;
`;

export default function TaskCard({
  title,
  subtasks,
  tags,
  deadline,
  priority,
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
          subtasks:
          <List>
            {subtasks.map((subtask, index) => (
              <ListItem key={index}>
                <SubtaskContainer>
                  <BulletPoint />
                  <SubtaskText>{subtask}</SubtaskText>
                </SubtaskContainer>
              </ListItem>
            ))}
          </List>
        </ListItem>
        <ListItem>
          tags:
          <TagList>
            {tags.map((tag) => (
              <TagItem key={tag}>
                <TagText>{tag}</TagText>
              </TagItem>
            ))}
          </TagList>
        </ListItem>
        <ListItem>
          deadline:<BoldText> {formattedDeadline}</BoldText>
        </ListItem>
        <ListItem>
          priority:<BoldText> {priority}</BoldText>
        </ListItem>
      </List>
    </Article>
  );
}
