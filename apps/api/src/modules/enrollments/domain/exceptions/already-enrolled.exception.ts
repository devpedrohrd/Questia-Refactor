export class AlreadyEnrolledException extends Error {
  constructor(userId: string, classId: string) {
    super(`User "${userId}" is already enrolled in class "${classId}"`)
    this.name = 'AlreadyEnrolledException'
  }
}
