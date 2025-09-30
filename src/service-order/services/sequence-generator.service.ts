import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from '../schemas/counter.schema';

@Injectable()
export class SequenceGeneratorService {
  constructor(
    @InjectModel(Counter.name)
    private counterModel: Model<CounterDocument>,
  ) {}

  /**
   * Gera o próximo número sequencial para ordens de serviço
   * @returns Promise<number> - Próximo número sequencial
   */
  async getNextSequenceNumber(): Promise<number> {
    try {
      const counter = await this.counterModel
        .findOneAndUpdate(
          { _id: 'serviceOrderSequence' }, // ID fixo para ordens de serviço
          { $inc: { sequence_value: 1 } }, // Incrementa em 1
          {
            new: true, // Retorna o documento atualizado
            upsert: true, // Cria se não existir
            setDefaultsOnInsert: true, // Aplica valores padrão na criação
          },
        )
        .exec();

      return counter.sequence_value;
    } catch (error) {
      console.error('Erro no SequenceGeneratorService:', error);
      throw new Error(
        `Erro ao gerar número sequencial: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Obtém o número sequencial atual (sem incrementar)
   * @returns Promise<number> - Número sequencial atual
   */
  async getCurrentSequenceNumber(): Promise<number> {
    try {
      const counter = await this.counterModel
        .findOne({ _id: 'serviceOrderSequence' })
        .exec();

      return counter ? counter.sequence_value : 0;
    } catch (error) {
      console.error('Erro ao obter número atual:', error);
      throw new Error(
        `Erro ao obter número atual: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Define um número sequencial específico
   * @param number - Número a ser definido
   * @returns Promise<number> - Número definido
   */
  async setSequenceNumber(number: number): Promise<number> {
    try {
      if (number < 1) {
        throw new Error('Número sequencial deve ser maior que 0');
      }

      const counter = await this.counterModel
        .findOneAndUpdate(
          { _id: 'serviceOrderSequence' },
          { sequence_value: number },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        )
        .exec();

      return counter.sequence_value;
    } catch (error) {
      console.error('Erro ao definir número sequencial:', error);
      throw new Error(
        `Erro ao definir número sequencial: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Obtém informações sobre a sequência atual
   * @returns Promise<{current: number, next: number}>
   */
  async getSequenceInfo(): Promise<{ current: number; next: number }> {
    try {
      const current = await this.getCurrentSequenceNumber();
      return {
        current,
        next: current + 1,
      };
    } catch (error) {
      console.error('Erro ao obter informações da sequência:', error);
      throw new Error(
        `Erro ao obter informações da sequência: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Verifica se a sequência existe no banco
   * @returns Promise<boolean>
   */
  async sequenceExists(): Promise<boolean> {
    try {
      const counter = await this.counterModel
        .findOne({ _id: 'serviceOrderSequence' })
        .exec();

      return !!counter;
    } catch (error) {
      console.error('Erro ao verificar existência da sequência:', error);
      return false;
    }
  }
}
