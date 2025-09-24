import {
  IPerson,
  ICreatePerson,
  IUpdatePerson,
} from '../schemas/models/person.interface';

export interface IPersonRepository {
  // CRUD básico
  create(personData: ICreatePerson): Promise<IPerson>;
  findById(id: string): Promise<IPerson | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: IPersonFilters,
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }>;
  update(id: string, personData: IUpdatePerson): Promise<IPerson | null>;
  delete(id: string): Promise<IPerson | null>;

  // Busca específica
  findByName(name: string): Promise<IPerson[]>;
  findByDocument(document: string): Promise<IPerson[]>;
  findByCorporateName(corporateName: string): Promise<IPerson[]>;
  findByPhone(phone: string): Promise<IPerson[]>;
  searchPerson(
    searchTerm: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }>;
}

export interface IPersonFilters {
  type?: 'customer' | 'supplier';
  pessoaJuridica?: boolean;
  blacklist?: boolean;
}
