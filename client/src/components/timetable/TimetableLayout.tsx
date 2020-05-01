import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '@material-ui/core';

const headerPadding = 15;

const BaseCell = styled.div<{
  x: number
  y: number
}>`
  grid-column: ${(props) => props.x};
  grid-row: ${(props) => props.y};
  box-shadow: 0 0 0 ${1 / devicePixelRatio}px ${(props) => props.theme.palette.secondary.main};

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const DoubleCell = styled(BaseCell)<{
  y: number
}>`
  grid-row: ${
  (props) => {
    props.y = props.y * 2 - 2;
    return `${props.y} / ${props.y + 2}`;
  }
};
`;

const DayCell = styled(BaseCell)`
  padding: ${headerPadding}px 0;
`;

const paddingStyle = css`
  padding: 0 ${headerPadding}px;
`;

const HourCell = styled(DoubleCell)<{
  is12HourMode: boolean
}>`
  ${paddingStyle}
  display: grid;
  justify-content: ${(props) => (props.is12HourMode ? 'end' : 'center')};
`;

const ToggleCell = styled(BaseCell)`
  ${paddingStyle}
  display: grid;
  justify-content: center;

  & span {
    grid-column: 1;
    grid-row: 1;
  }
`;

const Is12HourModeToggle = styled(Box)`
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: color 100ms;
  color: ${(props) => props.theme.palette.primary.main};

  &:hover {
    color: ${(props) => props.theme.palette.primary.dark};
  }
`;

const ColumnWidthGuide = styled.span`
  opacity: 0;
  pointer-events: none;
`;

const generateHour = (n: number, is12HourMode: boolean): string => {
  if (is12HourMode) {
    const period = n < 12 ? 'AM' : 'PM';
    if (n > 12) n -= 12;
    return `${n} ${period}`;
  }
  return `${String(n).padStart(2, '0')}:00`;
};

const generateHours = (range: number[], is12HourMode: boolean): string[] => {
  const [min, max] = range;
  // Fill an array with hour strings according to the range
  return Array(max - min + 1).fill(0).map((_, i) => generateHour(i + min, is12HourMode));
};

interface TimetableLayoutProps {
  days: string[]
  hoursRange: number[]
  is12HourMode: boolean
  setIs12HourMode(value: boolean): void
}

const TimetableLayout: FunctionComponent<TimetableLayoutProps> = ({
  days,
  hoursRange,
  is12HourMode,
  setIs12HourMode,
}) => {
  const hours: string[] = generateHours(hoursRange, is12HourMode);

  const dayCells = days.map((day, i) => (
    <DayCell key={day} x={i + 2} y={1}>
      {day}
    </DayCell>
  ));

  const hourCells = hours.map((hour, i) => (
    <HourCell key={hour} x={1} y={i + 2} is12HourMode={is12HourMode}>
      {hour}
    </HourCell>
  ));

  const otherCells = hours.map(
    (_, y) => days.map(
      (_, x) => <DoubleCell key={x * 1000 + y} x={x + 2} y={y + 2} />,
    ),
  );

  return (
    <>
      <ToggleCell key={0} x={1} y={1}>
        <Is12HourModeToggle component="span" onClick={() => setIs12HourMode(!is12HourMode)}>
          {`${is12HourMode ? '12' : '24'} h`}
        </Is12HourModeToggle>
        {
          // Invisible guide for the column width for
          // consistency between 24 and 12 hour time.
          // Content is something like '10 AM'.
        }
        <ColumnWidthGuide>{generateHour(10, true)}</ColumnWidthGuide>
      </ToggleCell>
      {dayCells}
      {hourCells}
      {otherCells}
    </>
  );
};

export default TimetableLayout;
