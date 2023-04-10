import { UserRole } from '@prisma/client';
import type { PipeTransform} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseUserRolePipe implements PipeTransform {
    public transform(value: unknown) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const possibleRoles = Object.values(UserRole).map((role) => role.toLowerCase());

        if (!possibleRoles.includes(value.toLowerCase())) {
            return undefined;
        }

        // Return the role
        return value.toUpperCase();
    }
}