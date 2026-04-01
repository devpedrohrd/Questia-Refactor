import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { EnrollmentNotFoundException } from '../../domain/exceptions/enrollment-not-found.exception'
import { AlreadyEnrolledException } from '../../domain/exceptions/already-enrolled.exception'
import { EnrollmentNotAuthorizedException } from '../../domain/exceptions/enrollment-not-authorized.exception'
import { ClassNotFoundException } from '../../../classes/domain/exceptions/class-not-found.exception'

const EXCEPTION_MAP = {
  [EnrollmentNotFoundException.name]: HttpStatus.NOT_FOUND,
  [ClassNotFoundException.name]: HttpStatus.NOT_FOUND,
  [AlreadyEnrolledException.name]: HttpStatus.CONFLICT,
  [EnrollmentNotAuthorizedException.name]: HttpStatus.FORBIDDEN,
}

@Catch(
  EnrollmentNotFoundException,
  AlreadyEnrolledException,
  EnrollmentNotAuthorizedException,
  ClassNotFoundException,
)
export class EnrollmentExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      EXCEPTION_MAP[exception.name] || HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    })
  }
}
