import { Response, Request } from 'express'

interface IGetCourseParams {
  courseId: string
}

/**
 * GET /api/course/:courseId/
 */
export const getCourse = (req: Request, res: Response) => {
  const params: IGetCourseParams = req.params
  res.send(params.courseId)
}