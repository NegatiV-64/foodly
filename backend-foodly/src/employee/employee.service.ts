import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_ERRORS } from 'src/shared/errors';
import type { CreateEmployeeDto } from './dto';
import type { EmployeeType, EmployeesQuery } from './interfaces';
import { employeeTypes } from './interfaces';

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) { }

    public async createEmployee({ email, password, phone, first_name, last_name, type }: CreateEmployeeDto) {
        const hashedPassword = await hash(password);

        await this.prisma.user.create({
            data: {
                user_email: email,
                user_phone: phone,
                user_password: hashedPassword,
                user_firstname: first_name,
                user_lastname: last_name,
                user_type: type,
                user_is_verified: true,
            }
        });
    }

    public async checkEmployeeType(user_id: number, ...types: EmployeeType[]) {
        const foundEmployee = await this.prisma.user.findUnique({
            where: {
                user_id,
            },
            select: {
                user_type: true,
            }
        });

        if (foundEmployee === null) {
            throw new NotFoundException(USER_ERRORS.NOT_FOUND('id'));
        }

        if (types !== undefined && types.length > 0) {
            if (types.includes(foundEmployee.user_type as EmployeeType) === false) {
                throw new ForbiddenException(USER_ERRORS.FORBIDDEN);
            }
        } else {
            if (employeeTypes.includes(foundEmployee.user_type as EmployeeType) === false) {
                throw new ForbiddenException(USER_ERRORS.FORBIDDEN);
            }
        }
    }

    public async getEmployees({ skip, take, type, order, sort = 'user_id' }: EmployeesQuery) {
        const [employees, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: {
                    user_type: type,
                },
                skip: skip,
                take: take,
                orderBy: {
                    [sort]: order,
                },
                select: {
                    user_address: true,
                    user_email: true,
                    user_firstname: true,
                    user_id: true,
                    user_is_verified: true,
                    user_lastname: true,
                    user_type: true,
                    user_phone: true,
                }
            }),
            this.prisma.user.count({
                where: {
                    user_type: type,
                },
                skip: skip,
                take: take,
                orderBy: {
                    [sort]: order,
                }
            })
        ]);

        return {
            employees,
            total,
        };
    }
}