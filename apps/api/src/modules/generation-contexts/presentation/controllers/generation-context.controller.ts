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
import { CreateGenerationContextDto } from '../dtos/create-generation-context.dto'
import { UpdateGenerationContextDto } from '../dtos/update-generation-context.dto'
import { GenerationContextExceptionFilter } from '../filters/generation-context-exception.filter'
import { CreateGenerationContextUseCase } from '../../application/use-cases/create-generation-context.use-case'
import { FindGenerationContextUseCase } from '../../application/use-cases/find-generation-context.use-case'
import { FindGenerationContextsByUserUseCase } from '../../application/use-cases/find-generation-contexts-by-user.use-case'
import { UpdateGenerationContextUseCase } from '../../application/use-cases/update-generation-context.use-case'
import { DeleteGenerationContextUseCase } from '../../application/use-cases/delete-generation-context.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { CurrentUser, Roles } from 'src/common/decorators'
import { Role } from 'src/common/enums'

@ApiTags('Generation Contexts')
@Controller('generation-contexts')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(GenerationContextExceptionFilter)
export class GenerationContextController {
  constructor(
    private readonly createUseCase: CreateGenerationContextUseCase,
    private readonly findUseCase: FindGenerationContextUseCase,
    private readonly findByUserUseCase: FindGenerationContextsByUserUseCase,
    private readonly updateUseCase: UpdateGenerationContextUseCase,
    private readonly deleteUseCase: DeleteGenerationContextUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Cria um novo contexto de geração' })
  @ApiResponse({
    status: 201,
    description: 'Contexto de geração criado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Apenas professores podem criar contextos',
  })
  async create(
    @Body() dto: CreateGenerationContextDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createUseCase.execute(dto, user)
  }

  @Get('my')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Lista os contextos de geração do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Contextos encontrados com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMyContexts(@CurrentUser() user: AuthenticatedUser) {
    return this.findByUserUseCase.execute(user.userId)
  }

  @Get(':id')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Busca um contexto de geração pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Contexto encontrado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Contexto não encontrado' })
  async findById(@Param('id') id: string) {
    return this.findUseCase.execute(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um contexto de geração pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Contexto atualizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar este contexto',
  })
  @ApiResponse({ status: 404, description: 'Contexto não encontrado' })
  @Roles(Role.PROFESSOR)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGenerationContextDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateUseCase.execute(id, dto, user)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um contexto de geração pelo ID' })
  @ApiResponse({
    status: 204,
    description: 'Contexto deletado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar este contexto',
  })
  @ApiResponse({ status: 404, description: 'Contexto não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.PROFESSOR)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.deleteUseCase.execute(id, user)
  }
}
