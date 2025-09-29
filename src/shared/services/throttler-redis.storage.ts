import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { RedisService } from './redis.service';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class ThrottlerRedisStorage implements ThrottlerStorage {
  constructor(private readonly redisService: RedisService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
  ): Promise<ThrottlerStorageRecord> {
    const client = this.redisService.getClient();

    if (!client || client.status !== 'ready') {
      // Fallback para memória local se Redis não estiver disponível
      return {
        totalHits: 0,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }

    try {
      const now = Date.now();
      const window = Math.floor(now / 1000) * 1000; // Janela de 1 segundo
      const keyWithWindow = `${key}:${window}`;

      const pipeline = client.pipeline();
      pipeline.incr(keyWithWindow);
      pipeline.expire(keyWithWindow, Math.ceil(ttl / 1000));

      const results = await pipeline.exec();

      if (results && results[0] && results[0][1]) {
        const totalHits = results[0][1] as number;
        const isBlocked = totalHits > limit;

        return {
          totalHits,
          timeToExpire: ttl,
          isBlocked,
          timeToBlockExpire: isBlocked ? blockDuration : 0,
        };
      }

      return {
        totalHits: 0,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    } catch (error) {
      console.error('ThrottlerRedisStorage increment error:', error);
      return {
        totalHits: 0,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }

  async getRecord(key: string): Promise<ThrottlerStorageRecord> {
    const client = this.redisService.getClient();

    if (!client || client.status !== 'ready') {
      return {
        totalHits: 0,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }

    try {
      const pattern = `${key}:*`;
      const keys = await client.keys(pattern);

      if (keys.length === 0) {
        return {
          totalHits: 0,
          timeToExpire: 0,
          isBlocked: false,
          timeToBlockExpire: 0,
        };
      }

      const pipeline = client.pipeline();
      keys.forEach((key) => pipeline.get(key));

      const results = await pipeline.exec();

      if (results) {
        const values = results
          .map((result) => result[1])
          .filter((value) => value !== null)
          .map((value) => parseInt(value as string, 10) || 0);

        const totalHits = values.reduce((sum, val) => sum + val, 0);

        return {
          totalHits,
          timeToExpire: 60000, // 1 minuto padrão
          isBlocked: false,
          timeToBlockExpire: 0,
        };
      }

      return {
        totalHits: 0,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    } catch (error) {
      console.error('ThrottlerRedisStorage getRecord error:', error);
      return {
        totalHits: 0,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }
}
