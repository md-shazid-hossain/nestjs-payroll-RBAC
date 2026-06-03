import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SoftDeleteDepartmentDto {
  @ApiProperty({
    description: 'Reason for deletion',
    example: 'Renamed department',
  })
  @IsString()
  @IsOptional()
  delete_reason?: string;

  @ApiProperty({
    description: 'ID of the user performing the delete',
    example: 42,
  })
  @IsNumber()
  deletedBy!: number; // not an object
}
