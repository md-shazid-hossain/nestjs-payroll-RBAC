import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { SalaryStructure } from 'src/salary-structure/salary-structure.entity';
import { Attendance, AttendanceStatus } from 'src/attendance/attendance.entity';
import { Tax } from 'src/tax/tax.entity';
import { Holiday } from 'src/holiday/holiday.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,

    @InjectRepository(Attendance)
    private attendenceRepository: Repository<Attendance>,

    @InjectRepository(SalaryStructure)
    private salaryStructure: Repository<SalaryStructure>,

    @InjectRepository(Tax)
    private taxRepository: Repository<Tax>,

    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async createPayroll(id: number, month: number) {
    // console.log(month, id);
    const startDate = new Date(2026, month, 1);
    const endDate = new Date(2026, month + 1, 0, 23, 59, 59);
    // ! total Present day count in a month
    const totalPresentDay = await this.attendenceRepository.count({
      where: {
        employee_id: { id: id },
        //! ArrayContains checks whether a Postgres array column includes the given value(s) in a TypeORM query.
        status: In([AttendanceStatus.LATE, AttendanceStatus.PRESENT]),
        date: Between(startDate, endDate),
      },
    });

    // console.log('present day', totalPresentDay);

    //! total late day count in a month
    const totalLateDay = await this.attendenceRepository.count({
      where: {
        employee_id: { id: id },
        status: AttendanceStatus.LATE,
        date: Between(startDate, endDate),
      },
    });

    // ! salary structure for specfic employee
    const salaryStructureEmployee = await this.salaryStructure.findOne({
      where: {
        employee_id: { id: id },
      },
    });

    if (!salaryStructureEmployee) {
      throw new NotFoundException(
        'Salary Structure not found for this employee',
      );
    }

    //! applying tax
    const findTax = await this.taxRepository.findOne({
      where: {
        minSalary: LessThanOrEqual(salaryStructureEmployee?.basicSalary),
        maxSalary: MoreThanOrEqual(salaryStructureEmployee?.basicSalary),
      },
    });

    // console.log({ message: 'why is null' }, findTax);

    const presentDaysSalary = salaryStructureEmployee?.basicSalary / 30;

    const totalSalary = totalPresentDay * presentDaysSalary;

    // console.log(totalPresentDay, presentDaysSalary);

    const deduction = totalLateDay * salaryStructureEmployee.latePenalty;

    const afterDeductionSalary = totalSalary - deduction;

    const appliedTax = afterDeductionSalary / (findTax?.percentage || 0);

    // console.log(appliedTax, findTax);

    const afterapplyingTaxAndDeductionSalary =
      afterDeductionSalary - appliedTax;

    const newPayroll = this.payrollRepository.create({
      employee: { id: id },
      month: month,
      gross: totalSalary,
      deduction: deduction,
      net: afterapplyingTaxAndDeductionSalary,
      taxDeduction: appliedTax,
    });

    return await this.payrollRepository.save(newPayroll);
  }

  async generatePaySlip(id: number) {
    const payroll = await this.payrollRepository.findOne({
      where: { employee: { id: id } },
      order: { id: 'DESC' },
      relations: ['employee'],
      select: {
        id: true,
        deduction: true,
        gross: true,
        month: true,
        net: true,
        status: true,
        taxDeduction: true,
        employee: {
          id: true,
          name: true,
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll Not Found!');
    }

    return payroll;
  }

  async getAllPayrolls() {
    return await this.payrollRepository.find({
      order: { id: 'DESC' },
      relations: ['employee'],
      select: {
        id: true,
        deduction: true,
        gross: true,
        month: true,
        net: true,
        status: true,
        taxDeduction: true,
        employee: {
          id: true,
          name: true,
        },
      },
    });
  }

  async getSalaryForEmployeeByMonth(empId: number, month: number) {
    const salaryByMonth = await this.payrollRepository.find({
      where: {
        employee: { id: empId },
        month: month,
      },
      relations: ['employee'],
      select: {
        employee: {
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    });

    return salaryByMonth;
  }

  //! payroll Record --------------------------------------------------------->
  async payrollRecord(employee_id: number, month: number) {
    const payrollData = await this.payrollRepository.find({
      where: { employee: { id: employee_id }, month: month },
      relations: { employee: { department_id: true } },
      select: {
        employee: {
          name: true,
          email: true,
          phone: true,
          designation: true,
          department_id: {
            name: true,
          },
        },
        month: true,
        gross: true,
        deduction: true,
        taxDeduction: true,
        status: true,
        net: true,
      },
    });

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
    const presentDay = await this.attendenceRepository.count({
      where: {
        employee_id: {
          id: employee_id,
        },
        date: Between(startDate, endDate),
      },
    });

    const absentDay = totalWorkingDays - presentDay;

    const lateDay = await this.attendenceRepository.count({
      where: {
        employee_id: { id: employee_id },
        status: AttendanceStatus.LATE,
        date: Between(startDate, endDate),
      },
    });

    const presentDayData = await this.attendenceRepository.find({
      where: {
        employee_id: {
          id: employee_id,
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

    const lateDayData = await this.attendenceRepository.find({
      where: {
        employee_id: { id: employee_id },
        status: AttendanceStatus.LATE,
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

    const salary = await this.salaryStructure.findOne({
      where: {
        employee_id: {
          id: employee_id,
        },
      },

      select: {
        id: true,
        basicSalary: true,
      },
    });

    return {
      total_working_days: totalWorkingDays,
      total_holidays: holidays,
      total_present_days: presentDay,
      total_absent_days: absentDay,
      total_late_days: lateDay,
      presentDayData,
      lateDayData,
      salary,
      payrollData,
    };
  }
}
