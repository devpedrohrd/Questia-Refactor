import { Global, Logger, Module, OnModuleInit } from '@nestjs/common'
import { CacheService } from './cache.service'
import { setCacheServiceInstance } from './cache.decorators'

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule implements OnModuleInit {
  private readonly logger = new Logger(CacheModule.name)

  constructor(private readonly cacheService: CacheService) {}

  onModuleInit() {
    setCacheServiceInstance(this.cacheService)
    this.logger.log(
      'CacheService inicializado e disponível para decorators @Cacheable/@CacheInvalidate',
    )
  }
}
