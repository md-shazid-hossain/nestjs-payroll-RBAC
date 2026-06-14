import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { MakePayrollDto } from './dtos/makePayroll.dto';

@ApiTags('Payroll')
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @ApiOperation({
    summary: 'Create payroll for an employee',
    description: 'Generates payroll for a given employee ID and month.',
  })
  @ApiBody({
    type: MakePayrollDto,
    description: 'Payload containing employee id and month',
  })
  @ApiResponse({ status: 201, description: 'Payroll created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPayroll(@Body() makePayrollDto: MakePayrollDto) {
    return await this.payrollService.createPayroll(
      makePayrollDto.id,
      makePayrollDto.month,
    );
  }

  @Get('payroll-report/:emp_id/:month')
  async payrollReport(
    @Param('emp_id') emp_id: number,
    @Param('month') month: number,
  ) {
    return await this.payrollService.payrollRecord(emp_id, month);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payrolls' })
  @ApiResponse({ status: 200, description: 'List of all payroll records' })
  async getAllPayrolls() {
    return this.payrollService.getAllPayrolls();
  }

  @Get('get-salary-by-month/:empid/:month')
  async getSalaryByMonth(
    @Param('empid') empid: number,
    @Param('month') month: number,
  ) {
    return this.payrollService.getSalaryForEmployeeByMonth(empid, month);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get employee payroll slip',
    description: 'Returns the payroll slip for a specific employee by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Employee ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payroll slip retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getPayrollSlip(@Param('id', ParseIntPipe) id: number) {
    return this.payrollService.generatePaySlip(id);
  }
}
