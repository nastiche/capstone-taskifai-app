import styled from "styled-components";

const Article = styled.article`
  border: 3px solid black;
  border-radius: 0.8rem;
  padding: 0.5rem;
`;

export default function TaskCard({
  title,
  category,
  deadline,
  prioritisation,
}) {
  return (
    <Article>
      <ul>
        <li>{title}</li>
        <li>{category}</li>
        <li>{deadline}</li>
        <li>{prioritisation}</li>
      </ul>
    </Article>
  );
}
