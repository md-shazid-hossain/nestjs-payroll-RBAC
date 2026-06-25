import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Attendance, AttendanceStatus } from './attendance.entity';
import { Employees } from '../employees/employees.entity';

@Injectable()
export class AttendanceSeederService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(Employees)
    private readonly employeeRepo: Repository<Employees>,
  ) {}

  async seed() {
    const employees = await this.employeeRepo.find();

    if (!employees.length) {
      throw new Error('No employees found. Seed employees before attendance.');
    }

    const attendanceRecords: Attendance[] = [];

    // Changed to 365 for a full year of history
    const daysToSeed = 365;

    for (const employee of employees) {
      for (let i = 0; i < daysToSeed; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Skip weekends (0 = Sunday, 6 = Saturday)
        const day = date.getDay();
        if (day === 0 || day === 6) continue;

        const status = faker.helpers.weightedArrayElement([
          { value: AttendanceStatus.PRESENT, weight: 80 },
          { value: AttendanceStatus.LATE, weight: 15 },
          { value: AttendanceStatus.ABSENT, weight: 5 },
        ]);

        const checkInTime = new Date(date);
        let checkOutTime: Date | undefined = new Date(date);

        if (status === AttendanceStatus.PRESENT) {
          checkInTime.setHours(
            faker.number.int({ min: 8, max: 9 }),
            faker.number.int({ min: 0, max: 59 }),
          );
          checkOutTime.setHours(
            faker.number.int({ min: 17, max: 18 }),
            faker.number.int({ min: 0, max: 59 }),
          );
        } else if (status === AttendanceStatus.LATE) {
          checkInTime.setHours(
            faker.number.int({ min: 10, max: 11 }),
            faker.number.int({ min: 0, max: 59 }),
          );
          checkOutTime.setHours(
            faker.number.int({ min: 17, max: 18 }),
            faker.number.int({ min: 0, max: 59 }),
          );
        } else {
          // Absent: DB strict schema requires checkInTime, setting to start of day
          checkInTime.setHours(0, 0, 0, 0);
          checkOutTime = undefined;
        }

        attendanceRecords.push(
          this.attendanceRepo.create({
            employee_id: employee,
            date,
            status,
            checkInTime,
            checkOutTime,
          }),
        );
      }
    }

    // Batch save is especially important here since 1 year for 100 employees
    // generates roughly 26,000 records. Chunking handles this perfectly.
    const chunkSize = 1000;
    for (let i = 0; i < attendanceRecords.length; i += chunkSize) {
      await this.attendanceRepo.save(attendanceRecords.slice(i, i + chunkSize));
    }

    console.log(
      `🌱 Attendance seeded with ${attendanceRecords.length} records!`,
    );
  }
}
