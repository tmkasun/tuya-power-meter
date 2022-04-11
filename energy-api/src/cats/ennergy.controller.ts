import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EnergyService as IOTService } from './energy.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';
@ApiBearerAuth()
@ApiTags('Energy')
@Controller('energy')
export class EnergyController {
  constructor(private readonly iotService: IOTService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.iotService.create(createCatDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Cat,
  })
  findOne(@Param('id') id: string): Cat {
    console.log('fffoooooooooooooooooooooooooooooooooooooobbb');
    return this.iotService.findOne(+id);
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Cat,
  })
  async getAll(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
  ): Promise<any> {
    return await this.iotService.getAll(offset, limit, orderBy, order, start, end);
  }
}
