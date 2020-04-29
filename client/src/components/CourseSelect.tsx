import React from 'react'
import { CourseOption } from '../App'
import { CoursesList } from '../interfaces/CourseOverview'
import { getCoursesList } from '../api/getCoursesList'
import Select from 'react-select'
import styled from 'styled-components'

const NUM_COURSE_OPTIONS = 10

const StyledSelect = styled(Select)`
  width: 100%;
  text-align: left;
`

interface CourseSelectProps {
  onChange(course: CourseOption): void
}

const CourseSelect: React.FC<CourseSelectProps> = ({ onChange }) => {
  const [coursesList, setCoursesList] = React.useState<CoursesList>([])
  const [options, setOptions] = React.useState<CourseOption[]>([])

  React.useEffect(() => {
    fetchClassesList()
  }, [])

  React.useEffect(() => {
    setOptions(courseSelectOptions.slice(0, NUM_COURSE_OPTIONS))
  }, [coursesList])

  const courseSelectOptions: CourseOption[] = coursesList.map(course => ({
    value: course.courseCode,
    label: `${course.courseCode} - ${course.name}`,
  }))

  const handleChange = (inputValue: string) => {
    setOptions(x => courseSelectOptions.filter(x => x.label.toLowerCase().includes(inputValue.toLocaleLowerCase())).slice(0, NUM_COURSE_OPTIONS))
  }

  const fetchClassesList = async () => {

    const coursesList = await getCoursesList('2020', 'T1')
    if (coursesList) {
      setCoursesList(coursesList)
    }
  }

  return (
    <StyledSelect
      options={options}
      value={null}
      onInputChange={handleChange}
      onChange={onChange}
      placeholder="Select a Course"
    />
  )

}

export default CourseSelect