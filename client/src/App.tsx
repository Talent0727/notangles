import React, { useEffect, FunctionComponent, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { MuiThemeProvider, Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Timetable from './components/timetable/Timetable';
import Navbar from './components/Navbar';
import Inventory from './components/inventory/Inventory';
import { CourseData } from './interfaces/CourseData';
import CourseSelect from './components/CourseSelect';

import getCourseInfo from './api/getCourseInfo';
import useColorMapper from './hooks/useColorMapper';

import storage from './utils/storage';

import { darkTheme, lightTheme } from './constants/theme';

const StyledApp = styled(Box)`
  height: 100%;
`;

const ContentWrapper = styled(Box)`
  text-align: center;
  padding-top: 84px; // 64px for nav bar + 20px padding
  padding-left: 30px;
  padding-right: 30px;
  transition: background-color 0.25s, color 0.25s;
  min-height: 100vh;
  box-sizing: border-box;

  background-color: ${(props) => props.theme.palette.background.default};
  color: ${(props) => props.theme.palette.text.primary};
`;

const Content = styled(Box)`
  width: 1200px;
  min-width: 600px;
  max-width: 100%;
  margin: auto;

  display: grid;
  grid-template-rows: min-content min-content auto;
  grid-template-columns: auto;

  text-align: center;
`;

const SelectWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const Footer = styled(Box)`
  text-align: center;
  font-size: 12px;
  margin: 40px;
`;

const App: FunctionComponent = () => {
  const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [is12HourMode, setIs12HourMode] = useState<boolean>(storage.get('is12HourMode'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(storage.get('isDarkMode'));

  const assignedColors = useColorMapper(
    selectedCourses.map((course) => course.courseCode),
  );

  useEffect(() => {
    storage.set('is12HourMode', is12HourMode);
  }, [is12HourMode]);

  useEffect(() => {
    storage.set('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  const handleSelectClass = (classId: string) => {
    setSelectedClassIds((prevSelectedClassIds) => {
      const [courseCode, activity] = classId.split('-');
      const newSelectedClassIds = prevSelectedClassIds.filter(
        (id) => !id.startsWith(`${courseCode}-${activity}`),
      );
      newSelectedClassIds.push(classId);
      return newSelectedClassIds;
    });
  };

  const handleRemoveClass = (activityId: string) => {
    setSelectedClassIds((prevSelectedClassIds) => {
      const newSelectedClassIds = prevSelectedClassIds.filter(
        (id) => !id.startsWith(activityId),
      );
      return newSelectedClassIds;
    });
  };

  // TODO: temp until auto-timetabling is done
  // currently just selects first available classes
  const populateTimetable = (newCourse: CourseData) => {
    Object.entries(newCourse.classes).forEach(([_, classes]) => {
      handleSelectClass(classes[0].classId);
    });
  };

  const handleSelectCourse = async (courseCode: string) => {
    const selectedCourseClasses = await getCourseInfo('2020', 'T2', courseCode);
    if (selectedCourseClasses) {
      const newSelectedCourses = [...selectedCourses, selectedCourseClasses];
      populateTimetable(selectedCourseClasses); // TODO: temp until auto-timetabling is done
      setSelectedCourses(newSelectedCourses);
    }
  };

  const handleRemoveCourse = (courseCode: string) => {
    const newSelectedCourses = selectedCourses.filter(
      (course) => course.courseCode !== courseCode,
    );
    setSelectedCourses(newSelectedCourses);
    setSelectedClassIds(
      selectedClassIds.filter((id) => id.split('-')[0] !== courseCode),
    );
  };

  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <StyledApp>
          <Navbar
            setIsDarkMode={setIsDarkMode}
            isDarkMode={isDarkMode}
          />
          <ContentWrapper>
            <Content>
              <SelectWrapper>
                <CourseSelect
                  selectedCourses={selectedCourses}
                  assignedColors={assignedColors}
                  handleSelect={handleSelectCourse}
                  handleRemove={handleRemoveCourse}
                />
              </SelectWrapper>
              <DndProvider backend={HTML5Backend}>
                <Inventory
                  selectedCourses={selectedCourses}
                  selectedClassIds={selectedClassIds}
                  assignedColors={assignedColors}
                  removeCourse={handleRemoveCourse}
                  removeClass={handleRemoveClass}
                />
                <Timetable
                  selectedCourses={selectedCourses}
                  selectedClassIds={selectedClassIds}
                  assignedColors={assignedColors}
                  is12HourMode={is12HourMode}
                  setIs12HourMode={setIs12HourMode}
                  onSelectClass={handleSelectClass}
                />
              </DndProvider>
              <Footer>
                DISCLAIMER: While we try our best, Notangles is not an
                official UNSW site, and cannot guarantee data accuracy or
                reliability.
                <br />
                <br />
                Made by &gt;_ CSESoc UNSW&nbsp;&nbsp;•&nbsp;&nbsp;
                <Link target="_blank" href="mailto:projects@csesoc.org.au">
                  Feedback
                </Link>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <Link target="_blank" href="https://github.com/csesoc/notangles">
                  GitHub
                </Link>
              </Footer>
            </Content>
          </ContentWrapper>
        </StyledApp>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
