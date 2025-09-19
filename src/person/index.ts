// Person Module Exports
export { PersonModule } from './person.module';
export { PersonService } from './person.service';
export { PersonController } from './person.controller';

// Schemas
export { Person, PersonSchema } from './schemas/person.schema';
export { Address, AddressSchema } from './schemas/address.schema';
export { Contact, ContactSchema } from './schemas/contact.schema';

// Interfaces
export type {
  IPerson,
  ICreatePerson,
  IUpdatePerson,
  IAddress,
  IContact,
} from './schemas/models/person.interface';

// Repository
export type {
  IPersonRepository,
  IPersonFilters,
} from './repositories/person.repository';
export { PersonMongooseRepository } from './repositories/mongoose/person.mongoose.repository';

// Utils
export { normalizeText } from './utils/text-normalizer';
