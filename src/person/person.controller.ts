import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import type {
  IPerson,
  ICreatePerson,
  IUpdatePerson,
} from './schemas/models/person.interface';
import type { IPersonFilters } from './repositories/person.repository';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // CRUD básico
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) personData: ICreatePerson,
  ): Promise<IPerson> {
    return this.personService.create(personData);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('type') type?: 'customer' | 'supplier',
    @Query('pessoaJuridica') pessoaJuridica?: boolean,
    @Query('blacklist') blacklist?: boolean,
  ): Promise<{ data: IPerson[]; total: number; page: number; limit: number }> {
    const filters: IPersonFilters = {};

    if (type) filters.type = type;
    if (pessoaJuridica !== undefined) filters.pessoaJuridica = pessoaJuridica;
    if (blacklist !== undefined) filters.blacklist = blacklist;

    return this.personService.findAll(page, limit, filters);
  }

  // Endpoints de busca específica (DEVEM vir ANTES das rotas com :id)
  @Get('search/name')
  async findByName(@Query('q') name: string): Promise<IPerson[]> {
    return this.personService.findByName(name);
  }

  @Get('search/document')
  async findByDocument(@Query('q') document: string): Promise<IPerson[]> {
    return this.personService.findByDocument(document);
  }

  @Get('search/corporate-name')
  async findByCorporateName(
    @Query('q') corporateName: string,
  ): Promise<IPerson[]> {
    return this.personService.findByCorporateName(corporateName);
  }

  @Get('search/phone')
  async findByPhone(@Query('q') phone: string): Promise<IPerson[]> {
    return this.personService.findByPhone(phone);
  }

  @Get('search')
  async searchPerson(@Query('q') searchTerm: string): Promise<IPerson[]> {
    return this.personService.searchPerson(searchTerm);
  }

  // Rotas com parâmetros dinâmicos (DEVEM vir DEPOIS das rotas específicas)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IPerson> {
    return this.personService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) personData: IUpdatePerson,
  ): Promise<IPerson> {
    return this.personService.update(id, personData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<IPerson> {
    return this.personService.delete(id);
  }
}
