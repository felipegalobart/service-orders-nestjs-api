import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type {
  IPersonRepository,
  IPersonFilters,
} from './repositories/person.repository';
import type {
  IPerson,
  ICreatePerson,
  IUpdatePerson,
  IAddress,
  IContact,
} from './schemas/models/person.interface';

@Injectable()
export class PersonService {
  constructor(
    @Inject('IPersonRepository')
    private readonly personRepository: IPersonRepository,
  ) {}

  // CRUD básico
  async create(personData: ICreatePerson): Promise<IPerson> {
    // Validações de negócio
    await this.validateCreatePerson(personData);

    // Aplicar valores padrão
    const personWithDefaults = this.applyDefaults(personData);

    return this.personRepository.create(personWithDefaults);
  }

  async findById(id: string): Promise<IPerson> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return person;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: IPersonFilters = {},
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }> {
    // Validar parâmetros de paginação
    if (page < 1) {
      throw new BadRequestException('Página deve ser maior que 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limite deve estar entre 1 e 100');
    }

    return this.personRepository.findAll(page, limit, filters);
  }

  async update(id: string, personData: IUpdatePerson): Promise<IPerson> {
    // Verificar se pessoa existe
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    // Validações de negócio
    await this.validateUpdatePerson(id, personData);

    const updatedPerson = await this.personRepository.update(id, personData);
    if (!updatedPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return updatedPerson;
  }

  async delete(id: string): Promise<IPerson> {
    // Verificar se pessoa existe
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    const deletedPerson = await this.personRepository.delete(id);
    if (!deletedPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return deletedPerson;
  }

  // Busca específica
  async findByName(name: string): Promise<IPerson[]> {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException('Nome deve ter pelo menos 2 caracteres');
    }

    return this.personRepository.findByName(name.trim());
  }

  async findByDocument(document: string): Promise<IPerson[]> {
    if (!document || document.trim().length < 3) {
      throw new BadRequestException(
        'Documento deve ter pelo menos 3 caracteres',
      );
    }

    return this.personRepository.findByDocument(document.trim());
  }

  async findByCorporateName(corporateName: string): Promise<IPerson[]> {
    if (!corporateName || corporateName.trim().length < 2) {
      throw new BadRequestException(
        'Razão social deve ter pelo menos 2 caracteres',
      );
    }

    return this.personRepository.findByCorporateName(corporateName.trim());
  }

  async findByPhone(phone: string): Promise<IPerson[]> {
    if (!phone || phone.trim().length < 8) {
      throw new BadRequestException(
        'Telefone deve ter pelo menos 8 caracteres',
      );
    }

    return this.personRepository.findByPhone(phone.trim());
  }

  async searchPerson(
    searchTerm: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Termo de busca deve ter pelo menos 2 caracteres',
      );
    }

    return this.personRepository.searchPerson(searchTerm.trim(), page, limit);
  }

  // Métodos privados para validações
  private async validateCreatePerson(personData: ICreatePerson): Promise<void> {
    // Validar documento único se fornecido
    if (personData.document) {
      const existingPersons = await this.personRepository.findByDocument(
        personData.document,
      );
      if (existingPersons.length > 0) {
        throw new ConflictException(
          `Documento ${personData.document} já está em uso`,
        );
      }
    }

    // Validar regras condicionais
    this.validateConditionalRules(personData);
  }

  private async validateUpdatePerson(
    id: string,
    personData: IUpdatePerson,
  ): Promise<void> {
    // Validar documento único se fornecido e diferente do atual
    if (personData.document) {
      const existingPersons = await this.personRepository.findByDocument(
        personData.document,
      );
      const isDifferentPerson = existingPersons.some(
        (person) => person.id !== id,
      );

      if (isDifferentPerson) {
        throw new ConflictException(
          `Documento ${personData.document} já está em uso por outra pessoa`,
        );
      }
    }

    // Validar regras condicionais
    this.validateConditionalRules(personData);
  }

  private validateConditionalRules(
    personData: ICreatePerson | IUpdatePerson,
  ): void {
    // Se isento de IE, inscrição estadual deve estar vazia
    if (personData.isExemptFromIE === true && personData.stateRegistration) {
      throw new BadRequestException(
        'Pessoa isenta de IE não pode ter inscrição estadual',
      );
    }

    // Se não é isento de IE, recomendar inscrição estadual para pessoa jurídica
    if (
      personData.isExemptFromIE === false &&
      personData.pessoaJuridica &&
      !personData.stateRegistration
    ) {
      // Apenas um aviso, não bloqueia a operação
      console.warn(
        'Pessoa jurídica não isenta de IE deveria ter inscrição estadual',
      );
    }

    // Validar endereços
    if (personData.addresses) {
      this.validateAddresses(personData.addresses);
    }

    // Validar contatos
    if (personData.contacts) {
      this.validateContacts(personData.contacts);
    }
  }

  private validateAddresses(addresses: IAddress[]): void {
    let defaultCount = 0;

    addresses.forEach((address, index) => {
      if (address.isDefault) {
        defaultCount++;
      }

      // Validação mais flexível - apenas verificar se pelo menos um campo foi preenchido
      const hasAnyField =
        address.street ||
        address.number ||
        address.city ||
        address.state ||
        address.neighborhood ||
        address.zipCode ||
        address.complement;

      // Se nenhum campo foi preenchido, é um endereço vazio - permitir
      if (!hasAnyField) {
        return;
      }

      // Validações opcionais - apenas se campos específicos forem fornecidos
      if (address.zipCode && !/^\d{5}-?\d{3}$/.test(address.zipCode)) {
        throw new BadRequestException(
          `Endereço ${index + 1}: CEP deve ter formato válido (00000-000)`,
        );
      }
    });

    if (defaultCount > 1) {
      throw new BadRequestException(
        'Apenas um endereço pode ser marcado como padrão',
      );
    }
  }

  private validateContacts(contacts: IContact[]): void {
    let defaultCount = 0;

    contacts.forEach((contact, index) => {
      if (contact.isDefault) {
        defaultCount++;
      }

      // Validação mais flexível - apenas verificar se pelo menos um campo foi preenchido
      const hasAnyField =
        contact.name || contact.phone || contact.email || contact.sector;

      // Se nenhum campo foi preenchido, é um contato vazio - permitir
      if (!hasAnyField) {
        return;
      }

      // Se pelo menos um campo foi preenchido, validar formato do email se fornecido
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        throw new BadRequestException(
          `Contato ${index + 1}: Email deve ter formato válido`,
        );
      }
    });

    if (defaultCount > 1) {
      throw new BadRequestException(
        'Apenas um contato pode ser marcado como padrão',
      );
    }
  }

  private applyDefaults(personData: ICreatePerson): ICreatePerson {
    return {
      ...personData,
      type: personData.type || 'customer',
      blacklist: personData.blacklist ?? false,
      pessoaJuridica: personData.pessoaJuridica ?? false,
      // Arrays já têm padrão [] no schema
      addresses: personData.addresses || [],
      contacts: personData.contacts || [],
    };
  }
}
