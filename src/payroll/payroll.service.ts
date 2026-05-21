import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SalaryStructure } from 'src/salary-structure/salary-structure.entity';
import { Attendance, AttendanceStatus } from 'src/attendance/attendance.entity';
import { Raw } from 'typeorm';
import { Tax } from 'src/tax/tax.entity';

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
  ) {}

  async createPayroll(id: number, month: number) {
    // console.log(month, id);

    // ! total workday
    const totalPresentDayOntime = await this.attendenceRepository.count({
      where: {
        employee_id: { id: id },
        //! ArrayContains checks whether a Postgres array column includes the given value(s) in a TypeORM query.
        status: AttendanceStatus.LATE || AttendanceStatus.PRESENT,

        date: Raw((alias) => `EXTRACT(MONTH FROM ${alias}) = :month`, {
          month,
        }),
      },
    });

    //! late day count
    const totalLateDay = await this.attendenceRepository.count({
      where: {
        employee_id: { id: id },
        status: AttendanceStatus.LATE,
        date: Raw((alias) => `EXTRACT(MONTH FROM ${alias}) = :month`, {
          month,
        }),
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

    console.log({ message: 'why is null' }, findTax);

    const presentDaysSalary = salaryStructureEmployee?.basicSalary / 30;

    const totalSalary = totalPresentDayOntime * presentDaysSalary;

    const deduction = totalLateDay * salaryStructureEmployee.latePenalty;

    const afterDeductionSalary = totalSalary - deduction;

    const appliedTax = afterDeductionSalary / (findTax?.percentage || 0);

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
    return await this.payrollRepository.findOne({
      where: { employee: { id: id } },
      order: { createdAt: 'DESC' },
      relations: ['employee'],
    });
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
}
