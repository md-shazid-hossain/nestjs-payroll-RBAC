import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceCreateDto } from './dtos/createAttendance.dto';
import { ConflictException } from '@nestjs/common';
import { Employees } from 'src/employees/employees.entity';
import { Holiday } from 'src/holiday/holiday.entity';

const officeStartTime = new Date();
officeStartTime.setHours(9, 0, 0, 0);

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(Employees)
    private employeeRepository: Repository<Employees>,

    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
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
    const isHoliday = await this.holidayRepository.findOne({
      where: {
        date: attendanceCreateDto.date,
      },
    });

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

  //! attendence reports
  async getAllPresentDays(employeeId: number, month: number) {
    const startDate = new Date(2026, month, 1);
    const endDate = new Date(2026, month + 1, 0, 23, 59, 59);

    const data = await this.attendanceRepository.find({
      where: {
        employee_id: {
          id: employeeId,
        },
        date: Between(startDate, endDate),
      },
      select: {
        id: true,
        checkInTime: true,
        checkOutTime: true,
        employee_id: {
          id: true,
          name: true,
        },
        status: true,
      },
    });

    return data;
  }

  async getAllLateDay(employeeId: number, month: number) {
    const startDate = new Date(2026, month, 1);
    const endDate = new Date(2026, month + 1, 0, 23, 59, 59);

    const data = await this.attendanceRepository.find({
      where: {
        employee_id: {
          id: employeeId,
        },
        date: Between(startDate, endDate),
        status: AttendanceStatus.LATE,
      },
      select: {
        id: true,
        checkInTime: true,
        checkOutTime: true,
        employee_id: {
          id: true,
          name: true,
        },
        status: true,
      },
    });

    return data;
  }

  //! attendence report on a month -------->
  async attendanceReportOnAMonth(month: number, employeeId: number) {
    //! calculating without weekend
    function getWeekdaysInMonth(year: number, month: number): Date[] {
      const weekdays: Date[] = [];
      const date = new Date(year, month, 1);

      while (date.getMonth() === month) {
        const dayOfWeek = date.getDay();

        //? friday and saturday is holiday
        if (dayOfWeek !== 5 && dayOfWeek !== 6) {
          weekdays.push(new Date(date));
        }

        date.setDate(date.getDate() + 1);
      }

      return weekdays;
    }

    const weekdays = getWeekdaysInMonth(2026, month);

    const totalWeekDay = weekdays.length;

    //! finding holidays
    const startDate = new Date(2026, month, 1);
    const endDate = new Date(2026, month + 1, 0, 23, 59, 59);

    const holidays = await this.holidayRepository.count({
      where: {
        date: Between(startDate, endDate),
      },
    });

    //! total working day
    const totalWorkingDays = totalWeekDay - holidays;

    //! present day
    const presentDay = await this.attendanceRepository.count({
      where: {
        employee_id: {
          id: employeeId,
        },
        date: Between(startDate, endDate),
      },
    });

    const absentDay = totalWorkingDays - presentDay;

    const lateDay = await this.attendanceRepository.count({
      where: { employee_id: { id: employeeId }, status: AttendanceStatus.LATE },
    });

    const presentdayData = await this.attendanceRepository.find({
      where: {
        employee_id: {
          id: employeeId,
        },
        date: Between(startDate, endDate),
      },
      select: {
        id: true,
        date: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
      },
    });

    const lateDayData = await this.attendanceRepository.find({
      where: { employee_id: { id: employeeId }, status: AttendanceStatus.LATE },
      select: {
        id: true,
        date: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
      },
    });

    return {
      total_working_days: totalWorkingDays,
      total_holidays: holidays,
      total_present_days: presentDay,
      presentdayData,
      total_absent_days: absentDay,
      total_late_days: lateDay,
      lateDayData,
    };
  }
}
