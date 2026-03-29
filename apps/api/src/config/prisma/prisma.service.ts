import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)
  private readonly pool: Pool

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_POOL_MAX ?? '20', 10),
      min: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      allowExitOnIdle: false,
    })

    const adapter = new PrismaPg(pool)

    super({
      adapter,
      log: process.env.NODE_ENV === 'production' ? ['warn'] : ['query', 'warn'],
      errorFormat: 'pretty',
    })

    this.pool = pool
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('✅ Prisma conectado ao banco de dados com sucesso!')
    } catch (err) {
      this.logger.error('❌ Erro ao conectar ao banco de dados:', err)
      throw err
    }
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Desconectando Prisma...')

    try {
      await this.$disconnect()
      this.logger.log('🟦 Prisma desconectado.')
    } catch (err) {
      this.logger.error('Erro ao desconectar Prisma:', err)
    }

    try {
      await this.pool.end()
      this.logger.log('🟦 Pool de conexões PostgreSQL encerrado.')
    } catch (err) {
      this.logger.error('Erro ao encerrar pool de conexões:', err)
    }
  }
}
