import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { UpdateDeliveryPointDto } from './dto/update-delivery-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryPoint } from './entities/delivery-point.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryPointService {

  private readonly logger = new Logger('DeliveryPointService')

  constructor (
    @InjectRepository(DeliveryPoint)
    private readonly deliveryPointRepository: Repository<DeliveryPoint>
  ) {}


  async create(createDeliveryPointDto: CreateDeliveryPointDto) {
    
    try {
      const deliveryPoint = this.deliveryPointRepository.create(createDeliveryPointDto);
      
      await this.deliveryPointRepository.save(deliveryPoint);

      return deliveryPoint;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {

    return this.deliveryPointRepository.find({})

  }

  async findOne(id: string) {
    try {
      const deliveryPoint = await this.deliveryPointRepository.findOneBy({id});
      if (!deliveryPoint) throw new NotFoundException(`Delivery point with id: ${id} not found.`)
      return deliveryPoint;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async update(id: string, updateDeliveryPointDto: UpdateDeliveryPointDto) {

    const deliveryPoint = await this.deliveryPointRepository.preload({
      id: id,
      ...updateDeliveryPointDto
    });

    if (!deliveryPoint) throw new NotFoundException(`Delivery pint with id: ${id} not found `)

    try {
      
      await this.deliveryPointRepository.save(deliveryPoint);
      return deliveryPoint;

    } catch (error) {
      this.logger.error(error)
      this.handleDBExceptions(error)

    }


  }

  async remove(id: string) {
    const deliveryPoint = await this.findOne(id);
    await this.deliveryPointRepository.remove(deliveryPoint);
  }

  async deleteAllDeliveryPoints () {
    const query = this.deliveryPointRepository.createQueryBuilder('deliveryPoint');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(error: any): never {
      if (error.code === '23505')
        throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
  


}
