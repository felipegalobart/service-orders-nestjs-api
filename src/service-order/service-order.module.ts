import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './services/service-order.service';
import { SequenceGeneratorService } from './services/sequence-generator.service';
import { ServiceOrderMongooseRepository } from './repositories/mongoose/service-order.mongoose.repository';
import {
  ServiceOrder,
  ServiceOrderSchema,
} from './schemas/service-order.schema';
import { Counter, CounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceOrder.name, schema: ServiceOrderSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [ServiceOrderController],
  providers: [
    ServiceOrderService,
    SequenceGeneratorService,
    {
      provide: 'IServiceOrderRepository',
      useClass: ServiceOrderMongooseRepository,
    },
  ],
  exports: [ServiceOrderService, SequenceGeneratorService],
})
export class ServiceOrderModule {}
