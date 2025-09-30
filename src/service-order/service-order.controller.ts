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
  NotFoundException,
} from '@nestjs/common';
import { ServiceOrderService } from './services/service-order.service';
import type {
  IServiceOrder,
  ICreateServiceOrder,
  IUpdateServiceOrder,
  ServiceOrderStatus,
  FinancialStatus,
} from './schemas/service-order.schema';
import type {
  IServiceOrderFilters,
  IPaginatedResult,
} from './repositories/service-order.repository';
import { ThrottleUser } from '../shared/decorators/throttle.decorator';

@Controller('service-orders')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  // CRUD básico
  @ThrottleUser()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) serviceOrderData: ICreateServiceOrder,
  ): Promise<IServiceOrder> {
    return this.serviceOrderService.create(serviceOrderData);
  }

  @ThrottleUser()
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: ServiceOrderStatus,
    @Query('financial') financial?: FinancialStatus,
    @Query('customerId') customerId?: string,
    @Query('equipment') equipment?: string,
    @Query('model') model?: string,
    @Query('brand') brand?: string,
    @Query('serialNumber') serialNumber?: string,
    @Query('customerName') customerName?: string,
    @Query('customerCorporateName') customerCorporateName?: string,
    @Query('customerTradeName') customerTradeName?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<IPaginatedResult> {
    const filters: IServiceOrderFilters = {};

    if (status) filters.status = status;
    if (financial) filters.financial = financial;
    if (customerId) filters.customerId = customerId;
    if (equipment) filters.equipment = equipment;
    if (model) filters.model = model;
    if (brand) filters.brand = brand;
    if (serialNumber) filters.serialNumber = serialNumber;
    if (customerName) filters.customerName = customerName;
    if (customerCorporateName)
      filters.customerCorporateName = customerCorporateName;
    if (customerTradeName) filters.customerTradeName = customerTradeName;
    if (isActive !== undefined) filters.isActive = isActive;

    return this.serviceOrderService.findAll(page, limit, filters);
  }

  // Endpoints de busca específica (DEVEM vir ANTES das rotas com :id)
  @Get('search/order-number')
  async findByOrderNumber(
    @Query('q') orderNumber: string,
  ): Promise<IServiceOrder> {
    const order = await this.serviceOrderService.findByOrderNumber(
      parseInt(orderNumber),
    );
    if (!order) {
      throw new NotFoundException(
        `Ordem de serviço com número ${orderNumber} não encontrada`,
      );
    }
    return order;
  }

  @Get('search/customer')
  async findByCustomer(
    @Query('q') customerId: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByCustomerId(customerId);
  }

  @Get('search/status')
  async findByStatus(
    @Query('q') status: ServiceOrderStatus,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByStatus(status);
  }

  @Get('search/equipment')
  async findByEquipment(
    @Query('q') equipment: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByEquipment(equipment);
  }

  @Get('search/model')
  async findByModel(@Query('q') model: string): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByModel(model);
  }

  @Get('search/brand')
  async findByBrand(@Query('q') brand: string): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByBrand(brand);
  }

  @Get('search/serial-number')
  async findBySerialNumber(
    @Query('q') serialNumber: string,
  ): Promise<IServiceOrder> {
    return this.serviceOrderService.findBySerialNumber(serialNumber);
  }

  @Get('search/customer-name')
  async findByCustomerName(
    @Query('q') customerName: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByCustomerName(customerName);
  }

  @Get('search/customer-corporate-name')
  async findByCustomerCorporateName(
    @Query('q') corporateName: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByCustomerCorporateName(corporateName);
  }

  @Get('search/customer-trade-name')
  async findByCustomerTradeName(
    @Query('q') tradeName: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderService.findByCustomerTradeName(tradeName);
  }

  @ThrottleUser()
  @Get('search')
  async searchServiceOrders(
    @Query('q') searchTerm: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<IPaginatedResult> {
    return this.serviceOrderService.search(searchTerm, page, limit);
  }

  // Endpoints de integração
  @Get('sequence/current')
  async getCurrentSequenceNumber(): Promise<{ currentNumber: number }> {
    const currentNumber =
      await this.serviceOrderService.getCurrentSequenceNumber();
    return { currentNumber };
  }

  @Get('sequence/info')
  async getSequenceInfo(): Promise<{
    currentNumber: number;
    exists: boolean;
  }> {
    const info = await this.serviceOrderService.getSequenceInfo();
    return info;
  }

  // Rotas com parâmetros dinâmicos (DEVEM vir DEPOIS das rotas específicas)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IServiceOrder> {
    return this.serviceOrderService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) serviceOrderData: IUpdateServiceOrder,
  ): Promise<IServiceOrder> {
    return this.serviceOrderService.update(id, serviceOrderData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<IServiceOrder> {
    return this.serviceOrderService.delete(id);
  }

  // Endpoints específicos para mudança de status
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ServiceOrderStatus,
  ): Promise<IServiceOrder> {
    return this.serviceOrderService.updateStatus(id, status);
  }

  @Put(':id/financial-status')
  async updateFinancialStatus(
    @Param('id') id: string,
    @Body('financial') financial: FinancialStatus,
  ): Promise<IServiceOrder> {
    return this.serviceOrderService.updateFinancialStatus(id, financial);
  }
}
