import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceCreateDto } from './dtos/createAttendance.dto';
import { ConflictException } from '@nestjs/common';
import { Employees } from 'src/employees/employees.entity';

const officeStartTime = new Date();
officeStartTime.setHours(9, 0, 0, 0);

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(Employees)
    private employeeRepository: Repository<Employees>,
  ) {}

  //! Create attendance record for an employee (checkin)
  async createAttendance(attendanceCreateDto: AttendanceCreateDto) {
    //! check if the employee exists on database
    const isEmployeeExists = await this.employeeRepository.findOne({
      where: { id: attendanceCreateDto.employee_id },
    });

    if (!isEmployeeExists) {
      throw new NotFoundException('Employee Does Not Exists!');
    }

    //! Check if attendance for the employee on the given date already exists
    const existesAttendance = await this.attendanceRepository.findOne({
      where: {
        date: attendanceCreateDto.date,
      },
    });

    if (existesAttendance) {
      throw new ConflictException(
        'Attendance for this employee on this date already exists in this date',
      );
    }

    //! Check if the date is a holiday
    const isHoliday = await this.attendanceRepository.manager.findOne(
      'Holiday',
      {
        where: {
          date: attendanceCreateDto.date,
        },
      },
    );

    if (isHoliday) {
      throw new ConflictException('Attendance cannot be created on a holiday');
    }

    //! Check if the employee is late
    if (new Date() > officeStartTime && !isHoliday) {
      const attendance = this.attendanceRepository.create({
        ...attendanceCreateDto,
        employee_id: { id: attendanceCreateDto.employee_id },
        status: AttendanceStatus.LATE,
        checkInTime: new Date(),
      });
      return await this.attendanceRepository.save(attendance);
    }

    const attendance = this.attendanceRepository.create({
      ...attendanceCreateDto,
      employee_id: { id: attendanceCreateDto.employee_id },
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date(),
    });
    return await this.attendanceRepository.save(attendance);
  }

  async getAllAttendances() {
    return await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.employee_id', 'employee')
      .select([
        'attendance.id',
        'attendance.checkInTime',
        'attendance.checkOutTime',
        'attendance.status',
        'employee.id',
      ])
      .orderBy('attendance.id', 'DESC')
      .getMany();
  }

  async getAttendanceById(id: number) {
    const attendence = await this.attendanceRepository.findOne({
      where: { id: id },
      relations: ['employee_id'],
      select: {
        id: true,
        checkInTime: true,
        checkOutTime: true,
        employee_id: {
          id: true,
        },
        status: true,
      },
    });

    if (!attendence) {
      throw new NotFoundException('Attendence Not Found');
    }

    return attendence;
  }

  async monthlyWorkingHour(id: number, month: number, year: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const totalAttendance = await this.attendanceRepository.count({
      where: {
        employee_id: { id },
        date: Between(startDate, endDate),
      },
      relations: ['employee_id'],
    });
    return totalAttendance * 8;
  }

  async checkOut(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new ConflictException('Attendance record not found');
    }

    if (attendance.checkInTime && attendance.checkOutTime) {
      throw new ConflictException('Employee has already checked out');
    }

    attendance.checkOutTime = new Date();
    return await this.attendanceRepository.save(attendance);
  }
}
