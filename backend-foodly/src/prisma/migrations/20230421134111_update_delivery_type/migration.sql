/*
  Warnings:

  - The values [PENDING] on the enum `DeliveryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryStatus_new" AS ENUM ('ON_WAY', 'DONE', 'CANCELED', 'FAILED');
ALTER TABLE "Delivery" ALTER COLUMN "delivery_status" TYPE "DeliveryStatus_new" USING ("delivery_status"::text::"DeliveryStatus_new");
ALTER TYPE "DeliveryStatus" RENAME TO "DeliveryStatus_old";
ALTER TYPE "DeliveryStatus_new" RENAME TO "DeliveryStatus";
DROP TYPE "DeliveryStatus_old";
COMMIT;
