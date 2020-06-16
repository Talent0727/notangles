export interface CourseData {
  courseCode: string
  courseName: string
  latestClassFinishTime: number
  classes: Record<string, ClassData[]>
}

export interface ClassData {
  classId: string
  courseCode: string
  activity: string
  periods: Period[]
  enrolments: number
  capacity: number
}

export interface Period {
  time: ClassTime
  location: string
  locationShort: string
}

export interface ClassTime {
  day: number
  start: number
  end: number
  weeks: string
}

export const filterOutClasses = (classes: ClassData[], a: ClassData) => (
  classes.filter((b) => (
    !(a.courseCode === b.courseCode && a.activity === b.activity)
  ))
);
