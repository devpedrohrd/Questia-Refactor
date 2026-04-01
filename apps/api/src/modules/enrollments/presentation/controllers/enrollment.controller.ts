import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateEnrollmentDto } from '../dtos/create-enrollment.dto'
import { EnrollmentExceptionFilter } from '../filters/enrollment-exception.filter'
import { EnrollUseCase } from '../../application/use-cases/enroll.use-case'
import { FindEnrollmentUseCase } from '../../application/use-cases/find-enrollment.use-case'
import { FindEnrollmentsByClassUseCase } from '../../application/use-cases/find-enrollments-by-class.use-case'
import { FindEnrollmentsByUserUseCase } from '../../application/use-cases/find-enrollments-by-user.use-case'
import { UnenrollUseCase } from '../../application/use-cases/unenroll.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { RolesGuard } from 'src/common/guards'

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(EnrollmentExceptionFilter)
export class EnrollmentController {
  constructor(
    private readonly enrollUseCase: EnrollUseCase,
    private readonly findEnrollmentUseCase: FindEnrollmentUseCase,
    private readonly findEnrollmentsByClassUseCase: FindEnrollmentsByClassUseCase,
    private readonly findEnrollmentsByUserUseCase: FindEnrollmentsByUserUseCase,
    private readonly unenrollUseCase: UnenrollUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Inscreve o usuário logado em uma turma pelo código',
  })
  @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 409, description: 'Usuário já inscrito nesta turma' })
  async enroll(
    @Body() dto: CreateEnrollmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.enrollUseCase.execute(dto.classCode, user)
  }

  @Get('my')
  @ApiOperation({ summary: 'Lista as inscrições do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Inscrições encontradas com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMyEnrollments(@CurrentUser() user: AuthenticatedUser) {
    return this.findEnrollmentsByUserUseCase.execute(user.userId)
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Lista as inscrições de uma turma' })
  @ApiResponse({
    status: 200,
    description: 'Inscrições encontradas com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByClass(@Param('classId') classId: string) {
    return this.findEnrollmentsByClassUseCase.execute(classId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma inscrição pelo ID' })
  @ApiResponse({ status: 200, description: 'Inscrição encontrada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async findById(@Param('id') id: string) {
    return this.findEnrollmentUseCase.execute(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma inscrição (desmatrícula)' })
  @ApiResponse({ status: 204, description: 'Inscrição removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para remover esta inscrição',
  })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unenroll(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.unenrollUseCase.execute(id, user)
  }
}
