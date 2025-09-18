import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';

const createStockSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(1),
  relationalId: z.number().min(1),
});

const updateStockSchema = z.object({
  stock: z.number().min(1),
});

type CreateStock = z.infer<typeof createStockSchema>;
type UpdateStock = z.infer<typeof updateStockSchema>;

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async getAllStock(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.stockService.getAllStock(limit, page);
  }

  @Get(':productId')
  async getStockById(@Param('productId') productId: string) {
    return this.stockService.getStockById(productId);
  }

  @UsePipes(new ZodValidationPipe(createStockSchema))
  @Post()
  async createStock(@Body() { name, quantity, relationalId }: CreateStock) {
    return this.stockService.createStock({ name, quantity, relationalId });
  }

  @Put(':productId')
  async updateStock(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(updateStockSchema)) { stock }: UpdateStock,
  ) {
    return this.stockService.updateStock(productId, stock);
  }

  @Delete(':productId')
  async deleteStock(@Param('productId') productId: string) {
    return this.stockService.deleteStock(productId);
  }
}
