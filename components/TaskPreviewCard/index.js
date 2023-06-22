import Link from "next/link";
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

const TitleText = styled.span`
  font-weight: 700;
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
`;

const TagText = styled.span`
  white-space: normal;
`;

const Anchor = styled.a`
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect() (0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export default function TaskPreviewCard({
  title,
  tags,
  deadline,
  priority,
  id,
}) {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : "";

  return (
    <Article>
      <List>
        <ListItem>
          task: <TitleText>{title}</TitleText>
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
      <Link href={`tasks/${id}`} passHref legacyBehavior>
        <Anchor>
          <ScreenReaderOnly>more info</ScreenReaderOnly>
        </Anchor>
      </Link>
    </Article>
  );
}
