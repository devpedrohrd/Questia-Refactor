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

@Catch(
  UserNotFoundException,
  EmailAlreadyExistsException,
  UserNotAutorizedException,
)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: number

    if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND
    } else if (exception instanceof EmailAlreadyExistsException) {
      status = HttpStatus.CONFLICT
    } else if (exception instanceof UserNotAutorizedException) {
      status = HttpStatus.UNAUTHORIZED
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    })
  }
}
