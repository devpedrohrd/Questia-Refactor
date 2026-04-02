import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { QuizNotAuthorizedException } from '../../domain/exceptions/quiz-not-authorized.exception'
import { QuizAlreadyPublishedException } from '../../domain/exceptions/quiz-already-published.exception'

const STATUS_CODES: Record<string, HttpStatus> = {
  QuizNotFoundException: HttpStatus.NOT_FOUND,
  QuizNotAuthorizedException: HttpStatus.FORBIDDEN,
  QuizAlreadyPublishedException: HttpStatus.CONFLICT,
}

@Catch(
  QuizNotFoundException,
  QuizNotAuthorizedException,
  QuizAlreadyPublishedException,
)
export class QuizExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      STATUS_CODES[exception.name] || HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    })
  }
}
