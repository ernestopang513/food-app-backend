// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryPointDto } from './create-delivery-point.dto';

export class UpdateDeliveryPointDto extends PartialType(CreateDeliveryPointDto) {}
