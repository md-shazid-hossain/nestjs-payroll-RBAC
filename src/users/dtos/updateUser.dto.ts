import { PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from '../../auth/dtos/userRegister.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
