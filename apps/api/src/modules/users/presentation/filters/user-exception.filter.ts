import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception'
import { UserNotAutorizedException } from '../../domain/exceptions/user-not-autorized.exception'

const EXCEPTION_MAP = {
  [UserNotFoundException.name]: HttpStatus.NOT_FOUND,
  [EmailAlreadyExistsException.name]: HttpStatus.CONFLICT,
  [UserNotAutorizedException.name]: HttpStatus.UNAUTHORIZED,
}

@Catch(
  UserNotFoundException,
  EmailAlreadyExistsException,
  UserNotAutorizedException,
)
export class UserExceptionFilter implements ExceptionFilter {
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
