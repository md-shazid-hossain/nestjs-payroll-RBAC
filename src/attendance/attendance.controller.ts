import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { AttendanceService } from './attendance.service';
import { AttendanceCreateDto } from './dtos/createAttendance.dto';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  createAttendance(@Body() attendanceCreateDto: AttendanceCreateDto) {
    return this.attendanceService.createAttendance(attendanceCreateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'List of all attendances' })
  getAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }

  // Specific GET routes first
  @Get('monthly-working-hours/:id/:month/:year')
  @ApiOperation({ summary: 'Get monthly working hours for an employee' })
  @ApiParam({ name: 'id', type: Number, description: 'Employee ID' })
  @ApiParam({ name: 'month', type: Number, description: 'Month (1-12)' })
  @ApiParam({ name: 'year', type: Number, description: 'Year (e.g. 2026)' })
  @ApiResponse({ status: 200, description: 'Monthly working hours fetched' })
  monthlyWorkingHour(
    @Param('id') id: number,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return this.attendanceService.monthlyWorkingHour(id, month, year);
  }

  @Get('get-all-present-day/:emp_id/:month')
  @ApiOperation({ summary: 'Get all present days for an employee' })
  @ApiParam({ name: 'emp_id', type: Number, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'List of present days' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getAllPresentDay(
    @Param('emp_id') emp_id: number,
    @Param('month') month: number,
  ) {
    return this.attendanceService.getAllPresentDays(emp_id, month);
  }

  @Get('get-all-late-day/:emp_id/:month')
  @ApiOperation({ summary: 'Get all late days for an employee' })
  @ApiParam({ name: 'emp_id', type: Number, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'List of late days' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getAllLateDay(
    @Param('emp_id') emp_id: number,
    @Param('month') month: number,
  ) {
    return this.attendanceService.getAllLateDay(emp_id, month);
  }

  @Get('attendance-report-on-a-month/:month/:employee_id')
  @ApiOperation({ summary: 'Get attendance report for an employee in a month' })
  @ApiParam({ name: 'month', type: Number, description: 'Month (1-12)' })
  @ApiParam({ name: 'employee_id', type: Number, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Attendance report generated' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async attendenceReportOnAMonth(
    @Param('month') month: number,
    @Param('employee_id') employee_id: number,
  ) {
    return await this.attendanceService.attendanceReportOnAMonth(
      month,
      employee_id,
    );
  }

  @Get(':attendance_id')
  @ApiOperation({ summary: 'Get attendance by ID' })
  @ApiParam({
    name: 'attendance_id',
    type: Number,
    description: 'Attendance ID',
  })
  @ApiResponse({ status: 200, description: 'Attendance found' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  getAttendanceById(@Param('attendance_id') attendance_id: number) {
    return this.attendanceService.getAttendanceById(attendance_id);
  }

  @Patch('check-out/:id')
  @ApiOperation({ summary: 'Check out an attendance record' })
  @ApiParam({ name: 'id', type: Number, description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Check-out successful' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  checkOut(@Param('id') id: number) {
    return this.attendanceService.checkOut(id);
  }
}
