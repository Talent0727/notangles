import React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import { useDrag } from 'react-dnd';

const StyledInventoryCourseClass = styled(Card).withConfig({
  shouldForwardProp: (prop) => ['children'].includes(prop),
}) <{
  isDragging: boolean
  backgroundColor: string
}>`
  // width: 100%;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: ${(props) => props.backgroundColor};
  opacity: ${(props) => (props.isDragging ? 0 : 1)};
  color: white;
  cursor: move;
  font-size: 0.9rem;
  border-radius: 6px;

  padding: 10px;
  position: relative;
  bottom: 0.5px;
  margin-bottom: 5px;

  p {
    margin: 0 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export interface InventoryCourseClassProps {
  courseCode: string
  activity: string
  color: string
}

const InventoryCourseClass: React.FC<InventoryCourseClassProps> = ({
  courseCode,
  activity,
  color,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: `${courseCode}-${activity}` },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <StyledInventoryCourseClass
      ref={drag}
      isDragging={isDragging}
      backgroundColor={color}
    >
      <b>
        {courseCode}
        {' '}
        {activity}
      </b>
    </StyledInventoryCourseClass>
  );
};

export default InventoryCourseClass;
