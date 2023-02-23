/*
  Warnings:

  - The values [SUPERADMIN,EMPLOYEE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CUSTOMER', 'ADMIN', 'MANAGER', 'DELIVERY_BOY');
ALTER TABLE "User" ALTER COLUMN "user_type" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "user_type" TYPE "UserRole_new" USING ("user_type"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "user_type" SET DEFAULT 'CUSTOMER';
COMMIT;
