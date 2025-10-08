import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Types } from 'mongoose';
import type {
  IServiceOrderRepository,
  IServiceOrderFilters,
  IPaginatedResult,
} from '../repositories/service-order.repository';
import {
  IServiceOrder,
  ICreateServiceOrder,
  IUpdateServiceOrder,
  ServiceOrderStatus,
  FinancialStatus,
  PaymentType,
} from '../schemas/service-order.schema';
import { SequenceGeneratorService } from './sequence-generator.service';
import { PersonService } from '../../person/person.service';

@Injectable()
export class ServiceOrderService {
  constructor(
    @Inject('IServiceOrderRepository')
    private readonly serviceOrderRepository: IServiceOrderRepository,
    private readonly sequenceGenerator: SequenceGeneratorService,
    private readonly personService: PersonService,
  ) {}

  // CRUD básico
  async create(serviceOrderData: ICreateServiceOrder): Promise<IServiceOrder> {
    // 1. Validações de negócio
    await this.validateCreateServiceOrder(serviceOrderData);

    // 2. Gerar número sequencial
    const orderNumber = await this.sequenceGenerator.getNextSequenceNumber();

    // 3. Aplicar valores padrão
    const orderWithDefaults = this.applyDefaults({
      ...serviceOrderData,
    });

    // 4. Criar ordem (totais calculados automaticamente pelo middleware do schema)
    return this.serviceOrderRepository.create({
      ...orderWithDefaults,
      orderNumber,
    });
  }

  async findById(id: string): Promise<IServiceOrder> {
    // Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    const serviceOrder = await this.serviceOrderRepository.findById(id);

    if (!serviceOrder) {
      throw new NotFoundException(
        `Ordem de serviço com ID ${id} não encontrada`,
      );
    }

    return serviceOrder;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: IServiceOrderFilters = {},
  ): Promise<IPaginatedResult> {
    // Validar parâmetros de paginação
    if (page < 1) {
      throw new BadRequestException('Página deve ser maior que 0');
    }
    if (limit < 1 || limit > 1000) {
      throw new BadRequestException('Limite deve estar entre 1 e 1000');
    }

    return this.serviceOrderRepository.findAll(page, limit, filters);
  }

  async update(
    id: string,
    serviceOrderData: IUpdateServiceOrder,
  ): Promise<IServiceOrder> {
    // 1. Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    // 2. Verificar se ordem existe
    const existingOrder = await this.serviceOrderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(
        `Ordem de serviço com ID ${id} não encontrada`,
      );
    }

    // 3. Validações de negócio
    this.validateUpdateServiceOrder(id, serviceOrderData);

    // 4. Atualizar (totais calculados automaticamente pelo middleware do schema)
    const updatedOrder = await this.serviceOrderRepository.update(
      id,
      serviceOrderData,
    );
    if (!updatedOrder) {
      throw new NotFoundException(
        `Ordem de serviço com ID ${id} não encontrada`,
      );
    }

    return updatedOrder;
  }

  async delete(id: string): Promise<IServiceOrder> {
    // 1. Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    // 2. Verificar se ordem existe
    const existingOrder = await this.serviceOrderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(
        `Ordem de serviço com ID ${id} não encontrada`,
      );
    }

    const deletedOrder = await this.serviceOrderRepository.delete(id);
    if (!deletedOrder) {
      throw new NotFoundException(
        `Ordem de serviço com ID ${id} não encontrada`,
      );
    }

    return deletedOrder;
  }

  // Busca específica
  async findByOrderNumber(orderNumber: number): Promise<IServiceOrder> {
    if (!orderNumber || orderNumber < 1) {
      throw new BadRequestException('Número da ordem deve ser maior que 0');
    }

    const serviceOrder =
      await this.serviceOrderRepository.findByOrderNumber(orderNumber);
    if (!serviceOrder) {
      throw new NotFoundException(
        `Ordem de serviço #${orderNumber} não encontrada`,
      );
    }

    return serviceOrder;
  }

  async findByCustomerId(customerId: string): Promise<IServiceOrder[]> {
    if (!customerId || customerId.trim().length === 0) {
      throw new BadRequestException('ID do cliente é obrigatório');
    }

    return this.serviceOrderRepository.findByCustomerId(customerId.trim());
  }

  async findByStatus(status: ServiceOrderStatus): Promise<IServiceOrder[]> {
    if (!status) {
      throw new BadRequestException('Status é obrigatório');
    }

    return this.serviceOrderRepository.findByStatus(status);
  }

  async findByFinancialStatus(
    financial: FinancialStatus,
  ): Promise<IServiceOrder[]> {
    if (!financial) {
      throw new BadRequestException('Status financeiro é obrigatório');
    }

    return this.serviceOrderRepository.findByFinancialStatus(financial);
  }

  // Busca por equipamento
  async findByEquipment(equipment: string): Promise<IServiceOrder[]> {
    if (!equipment || equipment.trim().length < 2) {
      throw new BadRequestException(
        'Equipamento deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.findByEquipment(equipment.trim());
  }

  async findByModel(model: string): Promise<IServiceOrder[]> {
    if (!model || model.trim().length < 2) {
      throw new BadRequestException('Modelo deve ter pelo menos 2 caracteres');
    }

    return this.serviceOrderRepository.findByModel(model.trim());
  }

  async findByBrand(brand: string): Promise<IServiceOrder[]> {
    if (!brand || brand.trim().length < 2) {
      throw new BadRequestException('Marca deve ter pelo menos 2 caracteres');
    }

    return this.serviceOrderRepository.findByBrand(brand.trim());
  }

  async findBySerialNumber(serialNumber: string): Promise<IServiceOrder> {
    if (!serialNumber || serialNumber.trim().length === 0) {
      throw new BadRequestException('Número de série é obrigatório');
    }

    const serviceOrder = await this.serviceOrderRepository.findBySerialNumber(
      serialNumber.trim(),
    );
    if (!serviceOrder) {
      throw new NotFoundException(
        `Ordem de serviço com série ${serialNumber} não encontrada`,
      );
    }

    return serviceOrder;
  }

  // Busca por cliente
  async findByCustomerName(customerName: string): Promise<IServiceOrder[]> {
    if (!customerName || customerName.trim().length < 2) {
      throw new BadRequestException(
        'Nome do cliente deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.findByCustomerName(customerName.trim());
  }

  async findByCustomerCorporateName(
    corporateName: string,
  ): Promise<IServiceOrder[]> {
    if (!corporateName || corporateName.trim().length < 2) {
      throw new BadRequestException(
        'Razão social deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.findByCustomerCorporateName(
      corporateName.trim(),
    );
  }

  async findByCustomerTradeName(tradeName: string): Promise<IServiceOrder[]> {
    if (!tradeName || tradeName.trim().length < 2) {
      throw new BadRequestException(
        'Nome fantasia deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.findByCustomerTradeName(
      tradeName.trim(),
    );
  }

  // Busca avançada
  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<IPaginatedResult> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Termo de busca deve ter pelo menos 2 caracteres',
      );
    }

    // Validar paginação
    if (page < 1) {
      throw new BadRequestException('Página deve ser maior que 0');
    }
    if (limit < 1 || limit > 1000) {
      throw new BadRequestException('Limite deve estar entre 1 e 1000');
    }

    return this.serviceOrderRepository.search(searchTerm.trim(), page, limit);
  }

  async searchByCustomer(searchTerm: string): Promise<IServiceOrder[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Termo de busca deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.searchByCustomer(searchTerm.trim());
  }

  async searchEquipment(searchTerm: string): Promise<IServiceOrder[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestException(
        'Termo de busca deve ter pelo menos 2 caracteres',
      );
    }

    return this.serviceOrderRepository.searchEquipment(searchTerm.trim());
  }

  // Métodos auxiliares
  async updateStatus(
    id: string,
    status: ServiceOrderStatus,
  ): Promise<IServiceOrder> {
    // Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
    return this.update(id, { status });
  }

  async updateFinancialStatus(
    id: string,
    financial: FinancialStatus,
  ): Promise<IServiceOrder> {
    // Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
    return this.update(id, { financial });
  }

  // Métodos de integração com sequence generator
  async getCurrentSequenceNumber(): Promise<number> {
    return this.sequenceGenerator.getCurrentSequenceNumber();
  }

  async getSequenceInfo(): Promise<{ currentNumber: number; exists: boolean }> {
    const currentNumber =
      await this.sequenceGenerator.getCurrentSequenceNumber();
    const exists = await this.sequenceGenerator.sequenceExists();
    return { currentNumber, exists };
  }

  // Métodos privados para validações
  private async validateCreateServiceOrder(
    serviceOrderData: ICreateServiceOrder,
  ): Promise<void> {
    // Validar campos obrigatórios
    if (!serviceOrderData.customerId) {
      throw new BadRequestException('ID do cliente é obrigatório');
    }

    // Validar se o cliente existe no banco de dados
    try {
      await this.personService.findById(serviceOrderData.customerId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `Cliente com ID ${serviceOrderData.customerId} não encontrado no banco de dados`,
        );
      }
      throw error;
    }

    if (
      !serviceOrderData.equipment ||
      serviceOrderData.equipment.trim().length === 0
    ) {
      throw new BadRequestException('Equipamento é obrigatório');
    }

    // Validar datas
    this.validateDates(serviceOrderData);

    // Validar valores financeiros
    this.validateFinancialValues(serviceOrderData);
  }

  private validateUpdateServiceOrder(
    id: string,
    serviceOrderData: IUpdateServiceOrder,
  ): void {
    // Validar datas
    this.validateDates(serviceOrderData);

    // Validar valores financeiros
    this.validateFinancialValues(serviceOrderData);
  }

  private validateDates(
    serviceOrderData: ICreateServiceOrder | IUpdateServiceOrder,
  ): void {
    const now = new Date();

    // Data prevista de entrega não pode ser no passado
    if (
      serviceOrderData.expectedDeliveryDate &&
      serviceOrderData.expectedDeliveryDate < now
    ) {
      throw new BadRequestException(
        'Data prevista de entrega não pode ser no passado',
      );
    }

    // Data de entrega não pode ser no futuro (com tolerância de 1 hora)
    if (
      'deliveryDate' in serviceOrderData &&
      serviceOrderData.deliveryDate &&
      serviceOrderData.deliveryDate > new Date(now.getTime() + 60 * 60 * 1000)
    ) {
      throw new BadRequestException('Data de entrega não pode ser no futuro');
    }
  }

  private validateFinancialValues(
    serviceOrderData: ICreateServiceOrder | IUpdateServiceOrder,
  ): void {
    // Validar parcelas
    if (
      serviceOrderData.installmentCount &&
      serviceOrderData.installmentCount < 1
    ) {
      throw new BadRequestException('Número de parcelas deve ser maior que 0');
    }

    if (
      serviceOrderData.paidInstallments &&
      serviceOrderData.paidInstallments < 0
    ) {
      throw new BadRequestException('Parcelas pagas não pode ser negativo');
    }

    if (
      serviceOrderData.installmentCount &&
      serviceOrderData.paidInstallments
    ) {
      if (
        serviceOrderData.paidInstallments > serviceOrderData.installmentCount
      ) {
        throw new BadRequestException(
          'Parcelas pagas não pode ser maior que total de parcelas',
        );
      }
    }
  }

  private applyDefaults(
    serviceOrderData: ICreateServiceOrder,
  ): ICreateServiceOrder {
    return {
      ...serviceOrderData,
      paymentType: serviceOrderData.paymentType || PaymentType.CASH,
      installmentCount: serviceOrderData.installmentCount || 1,
      paidInstallments: serviceOrderData.paidInstallments || 0,
      warranty: serviceOrderData.warranty ?? false,
      isReturn: serviceOrderData.isReturn ?? false,
    };
  }
}
