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

  async searchPerson(searchTerm: string): Promise<IPerson[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Termo de busca deve ter pelo menos 2 caracteres',
      );
    }

    return this.personRepository.searchPerson(searchTerm.trim());
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

      // Validar campos obrigatórios se endereço não está vazio
      const hasRequiredFields =
        address.street || address.number || address.city || address.state;
      if (hasRequiredFields) {
        if (!address.street) {
          throw new BadRequestException(
            `Endereço ${index + 1}: Rua é obrigatória`,
          );
        }
        if (!address.number) {
          throw new BadRequestException(
            `Endereço ${index + 1}: Número é obrigatório`,
          );
        }
        if (!address.city) {
          throw new BadRequestException(
            `Endereço ${index + 1}: Cidade é obrigatória`,
          );
        }
        if (!address.state) {
          throw new BadRequestException(
            `Endereço ${index + 1}: Estado é obrigatório`,
          );
        }
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

      // Validar campos obrigatórios se contato não está vazio
      const hasRequiredFields =
        contact.name || contact.phone || contact.email || contact.sector;
      if (hasRequiredFields) {
        if (!contact.name) {
          throw new BadRequestException(
            `Contato ${index + 1}: Nome é obrigatório`,
          );
        }
        if (!contact.phone) {
          throw new BadRequestException(
            `Contato ${index + 1}: Telefone é obrigatório`,
          );
        }
        if (!contact.email) {
          throw new BadRequestException(
            `Contato ${index + 1}: Email é obrigatório`,
          );
        }
        if (!contact.sector) {
          throw new BadRequestException(
            `Contato ${index + 1}: Setor é obrigatório`,
          );
        }
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
      // Arrays já têm padrão [] no schema
      addresses: personData.addresses || [],
      contacts: personData.contacts || [],
    };
  }
}
