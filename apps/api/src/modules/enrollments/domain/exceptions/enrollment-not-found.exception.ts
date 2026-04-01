export class EnrollmentNotFoundException extends Error {
  constructor(id: string) {
    super(`Enrollment with id "${id}" was not found`)
    this.name = 'EnrollmentNotFoundException'
  }
}
