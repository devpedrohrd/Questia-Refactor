import { Logger } from '@nestjs/common'
import { CacheService } from './cache.service'

const logger = new Logger('CacheDecorator')

/**
 * Referência estática ao CacheService, setada pelo CacheModule no onModuleInit.
 * Permite que os decorators acessem o serviço sem depender do DI do NestJS.
 */
let cacheServiceInstance: CacheService | null = null

export function setCacheServiceInstance(instance: CacheService): void {
  cacheServiceInstance = instance
}

export function getCacheServiceInstance(): CacheService | null {
  return cacheServiceInstance
}

/**
 * Gera uma chave de cache determinística baseada nos argumentos do método.
 * Filtra apenas tipos primitivos (string, number, boolean) para evitar
 * serializar objetos complexos como AuthenticatedUser.
 */
function buildCacheKey(prefix: string, args: any[]): string {
  const keyParts = args
    .filter(
      (arg) =>
        typeof arg === 'string' ||
        typeof arg === 'number' ||
        typeof arg === 'boolean',
    )
    .map(String)

  return `cache:${prefix}:${keyParts.join(':')}`
}

/**
 * @Cacheable - Decorator para cachear o resultado de um método.
 *
 * @param prefix - Prefixo para a chave de cache (ex: 'user', 'quiz')
 * @param ttl - Tempo de vida do cache em segundos (opcional, usa o padrão do CacheService)
 *
 * @example
 * ```ts
 * @Cacheable('user', 300)
 * async execute(id: string): Promise<User> { ... }
 * // Chave gerada: cache:user:<id>
 * ```
 */
export function Cacheable(prefix: string, ttl?: number): MethodDecorator {
  return function (
    _target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cache = cacheServiceInstance
      if (!cache) {
        logger.warn(
          `CacheService não disponível, executando ${String(propertyKey)} sem cache`,
        )
        return originalMethod.apply(this, args)
      }

      const key = buildCacheKey(prefix, args)

      const cached = await cache.get(key)
      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)

      if (result !== null && result !== undefined) {
        await cache.set(key, result, ttl)
      }

      return result
    }

    return descriptor
  }
}

/**
 * @CacheInvalidate - Decorator para invalidar chaves de cache após uma operação de escrita.
 *
 * @param patterns - Patterns de chaves a invalidar (suporta '*' wildcard).
 *   Pode ser strings estáticas ou funções que recebem os argumentos do método
 *   para gerar patterns dinâmicos.
 *
 * @example
 * ```ts
 * @CacheInvalidate('cache:class:*', (id: string) => `cache:class:${id}`)
 * async execute(id: string, data: UpdateClassInput): Promise<Class> { ... }
 * ```
 */
export function CacheInvalidate(
  ...patterns: Array<string | ((...args: any[]) => string)>
): MethodDecorator {
  return function (
    _target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)

      const cache = cacheServiceInstance
      if (!cache) {
        logger.warn(
          `CacheService não disponível, pulando invalidação em ${String(propertyKey)}`,
        )
        return result
      }

      const resolvedPatterns = patterns.map((p) =>
        typeof p === 'function' ? p(...args) : p,
      )

      await Promise.all(
        resolvedPatterns.map((pattern) => {
          if (pattern.includes('*')) {
            return cache.delByPattern(pattern)
          }
          return cache.del(pattern)
        }),
      )

      return result
    }

    return descriptor
  }
}
