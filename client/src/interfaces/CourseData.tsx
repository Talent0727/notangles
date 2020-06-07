export interface CourseData {
  courseCode: string
  courseName: string
  latestClassFinishTime: number
  classes: Record<string, ClassData[]>
}

export interface ClassData {
  classId: string
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
  day: string
  start: string
  end: string
  weeks: string
}
