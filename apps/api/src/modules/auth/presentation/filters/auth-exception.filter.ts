import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import {
  AuthException,
  InvalidCredentialsException,
  EmailAlreadyExistsException,
  InvalidTokenException,
} from '../../domain/exceptions'

const EXCEPTION_STATUS_MAP = new Map<string, HttpStatus>([
  [InvalidCredentialsException.name, HttpStatus.UNAUTHORIZED],
  [EmailAlreadyExistsException.name, HttpStatus.CONFLICT],
  [InvalidTokenException.name, HttpStatus.UNAUTHORIZED],
])

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name)

  catch(exception: AuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      EXCEPTION_STATUS_MAP.get(exception.constructor.name) ??
      HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.warn(`[${exception.code}] ${exception.message}`)

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
    })
  }
}
