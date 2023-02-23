/*
  Warnings:

  - A unique constraint covering the columns `[order_delivery_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `delivery_order` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_delivery_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_delivery_boy_fkey";

-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "delivery_order" TEXT NOT NULL,
ALTER COLUMN "delivery_boy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "order_delivery_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_delivery_id_key" ON "Order"("order_delivery_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_delivery_id_fkey" FOREIGN KEY ("order_delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_boy_fkey" FOREIGN KEY ("delivery_boy") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
