import { DbCourse, dbCourseToCourseData } from '../interfaces/DbCourse'
import { CourseData } from '../interfaces/CourseData'

const API_URL = process.env.REACT_APP_ENVIRONMENT === 'development' ? 'http://localhost:3001/api' : 'https://notangles-server.csesoc.unsw.edu.au/api'

/**
 * Fetches the information of a specified course
 * 
 * @param year The year that the course is offered in
 * @param term The term that the course is offered in
 * @param courseCode The code of the course to fetch
 * @return A promise containing the information of the course that is offered in the specified year and term
 * 
 * @example
 * const selectedCourseClasses = await getCourseInfo('2019', 'T3', 'COMP1511')
 */
export const getCourseInfo = async (
  year: string,
  term: string,
  courseCode: string
): Promise<CourseData | null> => {
  const baseURL = `${API_URL}/terms/${year}-${term}`
  try {
    const data = await fetch(`${baseURL}/courses/${courseCode}/`)
    const json: DbCourse = await data.json()
    if (!json) {
      throw Error('Fetch did not get results')
    }

    return dbCourseToCourseData(json)
  } catch (error) {
    console.error(error)
    return null
  }
}
