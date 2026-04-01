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
import { CreateClassDto } from '../dtos/create-class.dto'
import { UpdateClassDto } from '../dtos/update-class.dto'
import { ClassExceptionFilter } from '../filters/class-exception.filter'
import { CreateClassUseCase } from '../../application/use-cases/create-class.use-case'
import { FindClassUseCase } from '../../application/use-cases/find-class.use-case'
import { FindClassesByTeacherUseCase } from '../../application/use-cases/find-classes-by-teacher.use-case'
import { UpdateClassUseCase } from '../../application/use-cases/update-class.use-case'
import { DeleteClassUseCase } from '../../application/use-cases/delete-class.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CurrentUser, Roles } from 'src/common/decorators'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Role } from 'src/common/enums'

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(ClassExceptionFilter)
export class ClassController {
  constructor(
    private readonly createClassUseCase: CreateClassUseCase,
    private readonly findClassUseCase: FindClassUseCase,
    private readonly findClassesByTeacherUseCase: FindClassesByTeacherUseCase,
    private readonly updateClassUseCase: UpdateClassUseCase,
    private readonly deleteClassUseCase: DeleteClassUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Cria uma nova turma' })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Código da turma já existe' })
  async create(
    @Body() dto: CreateClassDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createClassUseCase.execute(dto, user)
  }

  @Get('my')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Lista as turmas do professor logado' })
  @ApiResponse({ status: 200, description: 'Turmas encontradas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMyClasses(@CurrentUser() user: AuthenticatedUser) {
    return this.findClassesByTeacherUseCase.execute(user.userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma turma pelo ID' })
  @ApiResponse({ status: 200, description: 'Turma encontrada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  async findById(@Param('id') id: string) {
    return this.findClassUseCase.execute(id)
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Atualiza uma turma pelo ID' })
  @ApiResponse({ status: 200, description: 'Turma atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar esta turma',
  })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateClassUseCase.execute(id, dto, user)
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Deleta uma turma pelo ID' })
  @ApiResponse({ status: 204, description: 'Turma deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar esta turma',
  })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.deleteClassUseCase.execute(id, user)
  }
}
