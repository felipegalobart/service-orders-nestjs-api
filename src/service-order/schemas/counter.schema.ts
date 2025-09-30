import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Tipo do documento
export type CounterDocument = HydratedDocument<Counter>;

// Schema do Counter para controle de sequência numérica
@Schema({ collection: 'counters' })
export class Counter {
  _id: string;

  @Prop({ type: Number, default: 0 })
  sequence_value: number;
}

// Schema factory
export const CounterSchema = SchemaFactory.createForClass(Counter);
