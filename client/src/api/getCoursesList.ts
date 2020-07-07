import { CoursesList } from '../interfaces/CourseOverview';
import { API_URL } from './config';

interface FetchedCourse {
  _id: string;
  courseCode: string;
  name: string;
}

const toCoursesList = (data: FetchedCourse[]): CoursesList => (
  data.map((course) => ({
    id: course._id,
    code: course.courseCode,
    name: course.name,
  }))
);

/**
 * Fetches a list of course objects, where each course object contains
 * the course id, the course code, and course name
 *
 * @param year The year that the courses are offered in
 * @param term The term that the courses are offered in
 * @return A promise containing the list of course objects offered in the specified year and term
 *
 * @example
 * const coursesList = await getCoursesList('2020', 'T1')
 */
const getCoursesList = async (
  year: string,
  term: string,
): Promise<CoursesList | null> => {
  const baseURL = `${API_URL}/terms/${year}-${term}`;
  try {
    const res = await fetch(`${baseURL}/courses/`);
    return toCoursesList(await res.json());
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getCoursesList;
