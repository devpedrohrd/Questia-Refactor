import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name)
  private readonly redis: Redis
  private readonly defaultTtl: number

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    this.defaultTtl = parseInt(
      process.env.CACHE_DEFAULT_TTL_SECONDS || '300',
      10,
    )

    this.redis.connect().catch((err) => {
      this.logger.error('Falha ao conectar ao Redis para cache', err)
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)

      if (!data) return null

      this.logger.debug(`Cache HIT: ${key}`)
      return JSON.parse(data) as T
    } catch (error) {
      this.logger.warn(`Erro ao ler cache [${key}]: ${error}`)
      return null
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const expiration = ttl ?? this.defaultTtl
      const serialized = JSON.stringify(value)

      await this.redis.set(key, serialized, 'EX', expiration)
      this.logger.debug(`Cache SET: ${key} (TTL: ${expiration}s)`)
    } catch (error) {
      this.logger.warn(`Erro ao salvar cache [${key}]: ${error}`)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
      this.logger.debug(`Cache DEL: ${key}`)
    } catch (error) {
      this.logger.warn(`Erro ao deletar cache [${key}]: ${error}`)
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0'
      let totalDeleted = 0

      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        )
        cursor = nextCursor

        if (keys.length > 0) {
          await this.redis.unlink(...keys)
          totalDeleted += keys.length
        }
      } while (cursor !== '0')

      if (totalDeleted > 0) {
        this.logger.debug(
          `Cache DEL pattern "${pattern}": ${totalDeleted} chaves removidas`,
        )
      }
    } catch (error) {
      this.logger.warn(
        `Erro ao deletar cache por pattern [${pattern}]: ${error}`,
      )
    }
  }

  async onModuleDestroy() {
    await this.redis.quit()
  }
}
