import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceOrder,
  ServiceOrderDocument,
} from '../../schemas/service-order.schema';
import {
  IServiceOrderRepository,
  IServiceOrderFilters,
  IPaginatedResult,
} from '../service-order.repository';
import {
  IServiceOrder,
  ICreateServiceOrder,
  IUpdateServiceOrder,
  ServiceOrderStatus,
  FinancialStatus,
} from '../../schemas/service-order.schema';

@Injectable()
export class ServiceOrderMongooseRepository implements IServiceOrderRepository {
  constructor(
    @InjectModel(ServiceOrder.name)
    private serviceOrderModel: Model<ServiceOrderDocument>,
  ) {}

  // CRUD básico
  async create(serviceOrderData: ICreateServiceOrder): Promise<IServiceOrder> {
    const serviceOrder = new this.serviceOrderModel(serviceOrderData);
    return serviceOrder.save();
  }

  async findById(id: string): Promise<IServiceOrder | null> {
    return this.serviceOrderModel
      .findOne({
        _id: id,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
    filters: IServiceOrderFilters = {},
  ): Promise<IPaginatedResult> {
    // Se tem filtros de cliente, usar agregação
    if (
      filters.customerName ||
      filters.customerCorporateName ||
      filters.customerTradeName
    ) {
      return this.findAllWithCustomerFilters(page, limit, filters);
    }

    // Se não tem filtros de cliente, usar query simples
    const query: Record<string, any> = {
      isActive: true,
      deletedAt: { $exists: false },
    };

    // Aplicar filtros
    if (filters.status) query.status = filters.status;
    if (filters.financial) query.financial = filters.financial;
    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.paymentType) query.paymentType = filters.paymentType;
    if (filters.equipment)
      query.equipment = { $regex: filters.equipment, $options: 'i' };
    if (filters.model) query.model = { $regex: filters.model, $options: 'i' };
    if (filters.brand) query.brand = { $regex: filters.brand, $options: 'i' };
    if (filters.serialNumber) query.serialNumber = filters.serialNumber;

    // Filtros de data
    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, total] = await Promise.all([
      this.serviceOrderModel
        .find(query)
        .skip(skip)
        .limit(validatedLimit)
        .sort({ createdAt: -1 })
        .exec(),
      this.serviceOrderModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit: validatedLimit,
    };
  }

  async update(
    id: string,
    serviceOrderData: IUpdateServiceOrder,
  ): Promise<IServiceOrder | null> {
    return this.serviceOrderModel
      .findByIdAndUpdate(
        id,
        { ...serviceOrderData, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  // Método para filtros combinados com cliente
  async findAllWithCustomerFilters(
    page: number,
    limit: number,
    filters: IServiceOrderFilters,
  ): Promise<IPaginatedResult> {
    const pipeline = [
      {
        $lookup: {
          from: 'persons',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $match: {
          // Filtros de cliente
          ...(filters.customerName && {
            'customer.name': { $regex: filters.customerName, $options: 'i' },
          }),
          ...(filters.customerCorporateName && {
            'customer.corporateName': {
              $regex: filters.customerCorporateName,
              $options: 'i',
            },
          }),
          ...(filters.customerTradeName && {
            'customer.tradeName': {
              $regex: filters.customerTradeName,
              $options: 'i',
            },
          }),

          // Outros filtros
          ...(filters.status && { status: filters.status }),
          ...(filters.financial && { financial: filters.financial }),
          ...(filters.customerId && { customerId: filters.customerId }),
          ...(filters.paymentType && { paymentType: filters.paymentType }),
          ...(filters.equipment && {
            equipment: { $regex: filters.equipment, $options: 'i' },
          }),
          ...(filters.model && {
            model: { $regex: filters.model, $options: 'i' },
          }),
          ...(filters.brand && {
            brand: { $regex: filters.brand, $options: 'i' },
          }),
          ...(filters.serialNumber && { serialNumber: filters.serialNumber }),

          // Filtros padrão
          isActive: true,
          deletedAt: { $exists: false },
        },
      },
      {
        $project: {
          customer: 0, // Remove dados do cliente
        },
      },
    ];

    // Filtros de data
    if (filters.dateRange) {
      const matchStage = pipeline[1] as { $match: Record<string, any> };
      matchStage.$match.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, totalResult] = await Promise.all([
      this.serviceOrderModel
        .aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: validatedLimit },
          { $sort: { createdAt: -1 } },
        ])
        .exec(),
      this.serviceOrderModel
        .aggregate([...pipeline, { $count: 'total' }])
        .exec(),
    ]);

    const total = (totalResult[0] as { total: number })?.total || 0;

    return {
      data: data as IServiceOrder[],
      total,
      page,
      limit: validatedLimit,
    };
  }

  async delete(id: string): Promise<IServiceOrder | null> {
    return this.serviceOrderModel
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
  async findByOrderNumber(orderNumber: number): Promise<IServiceOrder | null> {
    return this.serviceOrderModel
      .findOne({
        orderNumber: orderNumber,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async findByCustomerId(customerId: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        customerId: customerId,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: ServiceOrderStatus): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        status: status,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByFinancialStatus(
    financial: FinancialStatus,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        financial: financial,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Busca por equipamento
  async findByEquipment(equipment: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        equipment: { $regex: equipment, $options: 'i' },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByModel(model: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        model: { $regex: model, $options: 'i' },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByBrand(brand: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        brand: { $regex: brand, $options: 'i' },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findBySerialNumber(
    serialNumber: string,
  ): Promise<IServiceOrder | null> {
    return this.serviceOrderModel
      .findOne({
        serialNumber: serialNumber,
        isActive: true,
        deletedAt: { $exists: false },
      })
      .exec();
  }

  // Busca por cliente
  async findByCustomerName(customerName: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            'customer.name': { $regex: customerName, $options: 'i' },
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0, // Remove o campo customer do resultado
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  async findByCustomerCorporateName(
    corporateName: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            'customer.corporateName': { $regex: corporateName, $options: 'i' },
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0,
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  async findByCustomerTradeName(tradeName: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            'customer.tradeName': { $regex: tradeName, $options: 'i' },
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0,
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  // Busca combinada
  async findByEquipmentAndModel(
    equipment: string,
    model: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        equipment: { $regex: equipment, $options: 'i' },
        model: { $regex: model, $options: 'i' },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByBrandAndModel(
    brand: string,
    model: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        brand: { $regex: brand, $options: 'i' },
        model: { $regex: model, $options: 'i' },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomerNameAndStatus(
    customerName: string,
    status: ServiceOrderStatus,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            'customer.name': { $regex: customerName, $options: 'i' },
            status: status,
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0,
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  async findByCustomerAndEquipment(
    customerName: string,
    equipment: string,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            'customer.name': { $regex: customerName, $options: 'i' },
            equipment: { $regex: equipment, $options: 'i' },
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0,
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  // Busca avançada
  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<IPaginatedResult> {
    const pipeline = [
      {
        $lookup: {
          from: 'persons',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $match: {
          $or: [
            // Campos específicos da busca
            { 'customer.name': { $regex: searchTerm, $options: 'i' } },
            { equipment: { $regex: searchTerm, $options: 'i' } },
            { model: { $regex: searchTerm, $options: 'i' } },
            { status: { $regex: searchTerm, $options: 'i' } },
          ],
          isActive: true,
          deletedAt: { $exists: false },
        },
      },
      {
        $project: {
          customer: 0, // Remove dados do cliente do resultado
        },
      },
    ];

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, totalResult] = await Promise.all([
      this.serviceOrderModel
        .aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: validatedLimit },
          { $sort: { createdAt: -1 } },
        ])
        .exec(),
      this.serviceOrderModel
        .aggregate([...pipeline, { $count: 'total' }])
        .exec(),
    ]);

    const total = (totalResult[0] as { total: number })?.total || 0;

    return {
      data: data as IServiceOrder[],
      total,
      page,
      limit: validatedLimit,
    };
  }

  async searchEquipment(searchTerm: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        $or: [
          { equipment: { $regex: searchTerm, $options: 'i' } },
          { model: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { serialNumber: { $regex: searchTerm, $options: 'i' } },
        ],
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchByCustomer(searchTerm: string): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .aggregate([
        {
          $lookup: {
            from: 'persons',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $match: {
            $or: [
              { 'customer.name': { $regex: searchTerm, $options: 'i' } },
              {
                'customer.corporateName': { $regex: searchTerm, $options: 'i' },
              },
              { 'customer.tradeName': { $regex: searchTerm, $options: 'i' } },
            ],
            isActive: true,
            deletedAt: { $exists: false },
          },
        },
        {
          $project: {
            customer: 0,
          },
        },
      ])
      .exec() as Promise<IServiceOrder[]>;
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<IServiceOrder[]> {
    return this.serviceOrderModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        isActive: true,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Busca com paginação
  async findByEquipmentPaginated(
    equipment: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult> {
    const query = {
      equipment: { $regex: equipment, $options: 'i' },
      isActive: true,
      deletedAt: { $exists: false },
    };

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, total] = await Promise.all([
      this.serviceOrderModel
        .find(query)
        .skip(skip)
        .limit(validatedLimit)
        .sort({ createdAt: -1 })
        .exec(),
      this.serviceOrderModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit: validatedLimit,
    };
  }

  async findByCustomerIdPaginated(
    customerId: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult> {
    const query = {
      customerId: customerId,
      isActive: true,
      deletedAt: { $exists: false },
    };

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, total] = await Promise.all([
      this.serviceOrderModel
        .find(query)
        .skip(skip)
        .limit(validatedLimit)
        .sort({ createdAt: -1 })
        .exec(),
      this.serviceOrderModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit: validatedLimit,
    };
  }

  async findByCustomerNamePaginated(
    customerName: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult> {
    const pipeline = [
      {
        $lookup: {
          from: 'persons',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $match: {
          'customer.name': { $regex: customerName, $options: 'i' },
          isActive: true,
          deletedAt: { $exists: false },
        },
      },
      {
        $project: {
          customer: 0,
        },
      },
    ];

    const MAX_LIMIT = 100;
    const validatedLimit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const [data, totalResult] = await Promise.all([
      this.serviceOrderModel
        .aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: validatedLimit },
          { $sort: { createdAt: -1 } },
        ])
        .exec(),
      this.serviceOrderModel
        .aggregate([...pipeline, { $count: 'total' }])
        .exec(),
    ]);

    const total = (totalResult[0] as { total: number })?.total || 0;

    return {
      data: data as IServiceOrder[],
      total,
      page,
      limit: validatedLimit,
    };
  }
}
