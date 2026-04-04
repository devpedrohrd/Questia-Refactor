import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateQuizDto } from '../dtos/create-quiz.dto'
import { GenerateQuestionsDto } from '../dtos/generate-questions.dto'
import { ConfirmQuestionsDto } from '../dtos/confirm-questions.dto'
import { QuizExceptionFilter } from '../filters/quiz-exception.filter'
import { CreateQuizUseCase } from '../../application/use-cases/create-quiz.use-case'
import { GenerateQuestionsUseCase } from '../../application/use-cases/generate-questions.use-case'
import { ConfirmQuestionsUseCase } from '../../application/use-cases/confirm-questions.use-case'
import { FindQuizUseCase } from '../../application/use-cases/find-quiz.use-case'
import { FindQuizzesByClassUseCase } from '../../application/use-cases/find-quizzes-by-class.use-case'
import { FindQuizzesByUserUseCase } from '../../application/use-cases/find-quizzes-by-user.use-case'
import { PublishQuizUseCase } from '../../application/use-cases/publish-quiz.use-case'
import { DeleteQuizUseCase } from '../../application/use-cases/delete-quiz.use-case'
import { GetGeneratedPreviewUseCase } from '../../application/use-cases/get-generated-preview.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { CurrentUser, Roles } from 'src/common/decorators'
import { Role } from 'src/common/enums'

@ApiTags('Quizzes')
@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(QuizExceptionFilter)
export class QuizController {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly generateQuestionsUseCase: GenerateQuestionsUseCase,
    private readonly confirmQuestionsUseCase: ConfirmQuestionsUseCase,
    private readonly findQuizUseCase: FindQuizUseCase,
    private readonly findQuizzesByClassUseCase: FindQuizzesByClassUseCase,
    private readonly findQuizzesByUserUseCase: FindQuizzesByUserUseCase,
    private readonly publishQuizUseCase: PublishQuizUseCase,
    private readonly deleteQuizUseCase: DeleteQuizUseCase,
    private readonly getGeneratedPreviewUseCase: GetGeneratedPreviewUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Cria um novo quiz em status DRAFT' })
  @ApiResponse({ status: 201, description: 'Quiz criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Apenas professores podem criar quizzes',
  })
  async create(
    @Body() dto: CreateQuizDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createQuizUseCase.execute(dto, user)
  }

  @Post(':id/generate')
  @Roles(Role.PROFESSOR)
  @ApiOperation({
    summary: 'Gera questões via IA (preview, sem salvar no banco)',
  })
  @ApiResponse({
    status: 200,
    description: 'Questões geradas com sucesso (preview)',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para gerar questões neste quiz',
  })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  @HttpCode(HttpStatus.OK)
  async generateQuestions(
    @Param('id') id: string,
    @Body() dto: GenerateQuestionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.generateQuestionsUseCase.execute(
      id,
      dto.generationContextId,
      user,
    )
  }

  @Get(':id/generated-preview')
  @Roles(Role.PROFESSOR)
  @ApiOperation({
    summary:
      'Obtém o preview das questões geradas pela IA armazenadas no Redis',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado da geração (PENDING ou AVAILABLE e questões)',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  async getGeneratedPreview(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.getGeneratedPreviewUseCase.execute(id, user)
  }

  @Post(':id/confirm')
  @Roles(Role.PROFESSOR)
  @ApiOperation({
    summary: 'Salva as questões revisadas pelo professor no banco',
  })
  @ApiResponse({
    status: 200,
    description: 'Questões confirmadas e salvas com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para confirmar questões neste quiz',
  })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Quiz já publicado, não pode ser alterado',
  })
  @HttpCode(HttpStatus.OK)
  async confirmQuestions(
    @Param('id') id: string,
    @Body() dto: ConfirmQuestionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.confirmQuestionsUseCase.execute(id, dto.questions, user)
  }

  @Get('my')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Lista os quizzes do professor logado' })
  @ApiResponse({
    status: 200,
    description: 'Quizzes encontrados com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMyQuizzes(@CurrentUser() user: AuthenticatedUser) {
    return this.findQuizzesByUserUseCase.execute(user.userId)
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Lista os quizzes de uma turma' })
  @ApiResponse({
    status: 200,
    description: 'Quizzes encontrados com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByClass(@Param('classId') classId: string) {
    return this.findQuizzesByClassUseCase.execute(classId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um quiz pelo ID (com questões)' })
  @ApiResponse({ status: 200, description: 'Quiz encontrado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  async findById(@Param('id') id: string) {
    return this.findQuizUseCase.execute(id)
  }

  @Patch(':id/publish')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Publica um quiz (GENERATED → PUBLISHED)' })
  @ApiResponse({ status: 200, description: 'Quiz publicado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para publicar este quiz',
  })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.publishQuizUseCase.execute(id, user)
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Deleta um quiz' })
  @ApiResponse({ status: 204, description: 'Quiz deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar este quiz',
  })
  @ApiResponse({ status: 404, description: 'Quiz não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Quiz publicado não pode ser deletado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.deleteQuizUseCase.execute(id, user)
  }
}
