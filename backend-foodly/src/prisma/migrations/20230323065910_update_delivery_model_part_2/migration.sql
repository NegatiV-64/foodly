/*
  Warnings:

  - You are about to drop the column `delivery_boy` on the `Delivery` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_delivery_boy_fkey";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "delivery_boy",
ADD COLUMN     "delivery_boy_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_boy_id_fkey" FOREIGN KEY ("delivery_boy_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
