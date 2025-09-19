import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, PersonDocument } from '../../schemas/person.schema';
import { IPersonRepository, IPersonFilters } from '../person.repository';
import {
  IPerson,
  ICreatePerson,
  IUpdatePerson,
} from '../../schemas/models/person.interface';
import { normalizeText } from '../../utils/text-normalizer';

@Injectable()
export class PersonMongooseRepository implements IPersonRepository {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
  ) {}

  // CRUD básico
  async create(personData: ICreatePerson): Promise<IPerson> {
    const person = new this.personModel(personData);
    return person.save();
  }

  async findById(id: string): Promise<IPerson | null> {
    return this.personModel
      .findOne({
        _id: id,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: IPersonFilters = {},
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }> {
    const query: Record<string, any> = {
      isActive: true,
      deletedAt: { $exists: false },
    };

    // Aplicar filtros
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.pessoaJuridica !== undefined) {
      query.pessoaJuridica = filters.pessoaJuridica;
    }
    if (filters.blacklist !== undefined) {
      query.blacklist = filters.blacklist;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.personModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.personModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(id: string, personData: IUpdatePerson): Promise<IPerson | null> {
    return this.personModel
      .findByIdAndUpdate(
        id,
        { ...personData, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<IPerson | null> {
    return this.personModel
      .findByIdAndUpdate(
        id,
        {
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  // Busca específica
  async findByName(name: string): Promise<IPerson[]> {
    const normalizedName = normalizeText(name);

    return this.personModel
      .find({
        $or: [
          // Busca normalizada (ignora acentos)
          { name: { $regex: normalizedName, $options: 'i' } },
          // Busca original (fallback)
          { name: { $regex: name, $options: 'i' } },
        ],
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findByDocument(document: string): Promise<IPerson[]> {
    return this.personModel
      .find({
        document: document,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findByCorporateName(corporateName: string): Promise<IPerson[]> {
    const normalizedCorporateName = normalizeText(corporateName);

    return this.personModel
      .find({
        $or: [
          // Busca normalizada (ignora acentos)
          { corporateName: { $regex: normalizedCorporateName, $options: 'i' } },
          // Busca original (fallback)
          { corporateName: { $regex: corporateName, $options: 'i' } },
        ],
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findByPhone(phone: string): Promise<IPerson[]> {
    return this.personModel
      .find({
        'contacts.phone': phone,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async searchPerson(searchTerm: string): Promise<IPerson[]> {
    const normalizedTerm = normalizeText(searchTerm);

    return this.personModel
      .find({
        $or: [
          // Busca normalizada (ignora acentos) - campos de texto
          { name: { $regex: normalizedTerm, $options: 'i' } },
          { corporateName: { $regex: normalizedTerm, $options: 'i' } },
          { tradeName: { $regex: normalizedTerm, $options: 'i' } },
          { 'contacts.name': { $regex: normalizedTerm, $options: 'i' } },
          { 'contacts.sector': { $regex: normalizedTerm, $options: 'i' } },

          // Busca original (fallback) - campos de texto
          { name: { $regex: searchTerm, $options: 'i' } },
          { corporateName: { $regex: searchTerm, $options: 'i' } },
          { tradeName: { $regex: searchTerm, $options: 'i' } },
          { 'contacts.name': { $regex: searchTerm, $options: 'i' } },
          { 'contacts.sector': { $regex: searchTerm, $options: 'i' } },

          // Buscas exatas (não precisam normalizar)
          { document: searchTerm },
          { stateRegistration: searchTerm },
          { municipalRegistration: searchTerm },
          { 'contacts.phone': searchTerm },
          { 'contacts.email': searchTerm },
        ],
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }
}
