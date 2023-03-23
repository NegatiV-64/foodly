/*
  Warnings:

  - You are about to drop the column `delivery_date` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_order` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `delivery_order_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "delivery_date",
DROP COLUMN "delivery_order",
ADD COLUMN     "delivery_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delivery_finished_at" TIMESTAMP(3),
ADD COLUMN     "delivery_order_id" TEXT NOT NULL;
