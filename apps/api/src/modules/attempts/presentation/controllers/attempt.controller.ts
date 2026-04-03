import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SubmitAttemptDto } from '../dtos/submit-attempt.dto'
import { AttemptExceptionFilter } from '../filters/attempt-exception.filter'
import { SubmitAttemptUseCase } from '../../application/use-cases/submit-attempt.use-case'
import { FindAttemptUseCase } from '../../application/use-cases/find-attempt.use-case'
import { FindAttemptsByQuizUseCase } from '../../application/use-cases/find-attempts-by-quiz.use-case'
import { FindAttemptsByUserUseCase } from '../../application/use-cases/find-attempts-by-user.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { CurrentUser, Roles } from 'src/common/decorators'
import { Role } from 'src/common/enums'

@ApiTags('Attempts')
@Controller('attempts')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AttemptExceptionFilter)
export class AttemptController {
  constructor(
    private readonly submitAttemptUseCase: SubmitAttemptUseCase,
    private readonly findAttemptUseCase: FindAttemptUseCase,
    private readonly findAttemptsByQuizUseCase: FindAttemptsByQuizUseCase,
    private readonly findAttemptsByUserUseCase: FindAttemptsByUserUseCase,
  ) {}

  @Post()
  @Roles(Role.ALUNO)
  @ApiOperation({
    summary: 'Submete uma tentativa de quiz (corrige e calcula nota)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tentativa submetida e corrigida com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Quiz não está publicado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Apenas alunos podem submeter tentativas',
  })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Aluno já respondeu este quiz',
  })
  async submit(
    @Body() dto: SubmitAttemptDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.submitAttemptUseCase.execute(dto.quizId, dto.answers, user)
  }

  @Get('my')
  @Roles(Role.ALUNO)
  @ApiOperation({ summary: 'Lista o histórico de tentativas do aluno logado' })
  @ApiResponse({
    status: 200,
    description: 'Tentativas encontradas com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMyAttempts(@CurrentUser() user: AuthenticatedUser) {
    return this.findAttemptsByUserUseCase.execute(user.userId)
  }

  @Get('quiz/:quizId')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Lista todas as tentativas de um quiz' })
  @ApiResponse({
    status: 200,
    description: 'Tentativas encontradas com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByQuiz(@Param('quizId') quizId: string) {
    return this.findAttemptsByQuizUseCase.execute(quizId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Busca uma tentativa pelo ID (com respostas e questões)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tentativa encontrada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Tentativa não encontrada' })
  async findById(@Param('id') id: string) {
    return this.findAttemptUseCase.execute(id)
  }
}
