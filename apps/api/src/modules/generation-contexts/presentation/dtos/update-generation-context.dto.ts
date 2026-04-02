import { PartialType } from '@nestjs/swagger'
import { CreateGenerationContextDto } from './create-generation-context.dto'

export class UpdateGenerationContextDto extends PartialType(
  CreateGenerationContextDto,
) {}
