import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class EmployeeCreateDto {
  @ApiProperty({
    description: 'Full name of the employee',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  @MaxLength(100, { message: 'email must be at most 100 characters' })
  email!: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+8801712345678',
    maxLength: 100,
  })
  @IsString({ message: 'phone must be a string' })
  @IsNotEmpty({ message: 'phone is required' })
  @MaxLength(100, { message: 'phone must be at most 100 characters' })
  phone!: string;

  @ApiProperty({
    description: 'Department ID',
    example: 1,
  })
  @IsNotEmpty({ message: 'department_id is required' })
  department_id!: number;

  // @ApiProperty({
  //   description: 'Base salary',
  //   example: 50000,
  // })
  // @IsNotEmpty({ message: 'base_salary is required' })
  // @IsNumber({}, { message: 'base_salary must be a number' })
  // base_salary!: number;

  @ApiProperty({
    description: 'Active status (true = active, false = inactive)',
    example: true,
  })
  @IsNotEmpty({ message: 'status is required' })
  status!: boolean;

  @ApiProperty({
    description: 'Joining date',
    example: '2026-05-10',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'joiningDate is required' })
  @IsDate({ message: 'joiningDate must be a valid date' })
  @Type(() => Date)
  joiningDate!: Date;

  // Newly added fields matching the entity

  @ApiProperty({
    description: 'Gender',
    example: 'Male',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'gender is required' })
  @IsString({ message: 'gender must be a string' })
  @MaxLength(100, { message: 'gender must be at most 100 characters' })
  gender!: string;

  @ApiProperty({
    description: "Father's name",
    example: 'Robert Doe',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'fathersName is required' })
  @IsString({ message: 'fathersName must be a string' })
  @MaxLength(100, { message: 'fathersName must be at most 100 characters' })
  fathersName!: string;

  @ApiProperty({
    description: "Mother's name",
    example: 'Jane Doe',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'mothersName is required' })
  @IsString({ message: 'mothersName must be a string' })
  @MaxLength(100, { message: 'mothersName must be at most 100 characters' })
  mothersName!: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-15',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'dateOfBirth is required' })
  @IsDate({ message: 'dateOfBirth must be a valid date' })
  @Type(() => Date)
  dateOfBirth!: Date;

  @ApiProperty({
    description: 'National ID number',
    example: '1234567890',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'nid is required' })
  @IsString({ message: 'nid must be a string' })
  @MaxLength(100, { message: 'nid must be at most 100 characters' })
  nid!: string;

  @ApiProperty({
    description: 'Highest education level',
    example: 'Bachelor of Science',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'education is required' })
  @IsString({ message: 'education must be a string' })
  @MaxLength(100, { message: 'education must be at most 100 characters' })
  education!: string;

  @ApiProperty({
    description: 'Present address',
    example: '123 Main Street, Dhaka',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'presentAddress is required' })
  @IsString({ message: 'presentAddress must be a string' })
  @MaxLength(100, { message: 'presentAddress must be at most 100 characters' })
  presentAddress!: string;

  @ApiProperty({
    description: 'Permanent address',
    example: '456 Village Road, Khulna',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'permanentAddress is required' })
  @IsString({ message: 'permanentAddress must be a string' })
  @MaxLength(100, {
    message: 'permanentAddress must be at most 100 characters',
  })
  permanentAddress!: string;

  @ApiProperty({
    description: 'Previous work experience',
    example: '5 years at XYZ Corp',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'experience is required' })
  @IsString({ message: 'experience must be a string' })
  @MaxLength(100, { message: 'experience must be at most 100 characters' })
  experience!: string;

  // @ApiProperty({
  //   description: 'Existing user ID to link (optional)',
  //   example: 42,
  //   required: false,
  // })
  // @IsOptional()
  // @IsNumber()
  // user?: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
