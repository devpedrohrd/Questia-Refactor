import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { ClassNotFoundException } from '../../domain/exceptions/class-not-found.exception'
import { ClassCodeAlreadyExistsException } from '../../domain/exceptions/class-code-already-exists.exception'
import { ClassNotAuthorizedException } from '../../domain/exceptions/class-not-authorized.exception'

const EXCEPTION_MAP = {
  [ClassNotFoundException.name]: HttpStatus.NOT_FOUND,
  [ClassCodeAlreadyExistsException.name]: HttpStatus.CONFLICT,
  [ClassNotAuthorizedException.name]: HttpStatus.FORBIDDEN,
}

@Catch(
  ClassNotFoundException,
  ClassCodeAlreadyExistsException,
  ClassNotAuthorizedException,
)
export class ClassExceptionFilter implements ExceptionFilter {
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
