import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonMongooseRepository } from './repositories/mongoose/person.mongoose.repository';
import { Person, PersonSchema } from './schemas/person.schema';
import { IPersonRepository } from './repositories/person.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: 'IPersonRepository',
      useClass: PersonMongooseRepository,
    },
  ],
  exports: [PersonService],
})
export class PersonModule {}
