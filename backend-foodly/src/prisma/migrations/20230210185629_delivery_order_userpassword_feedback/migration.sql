/*
  Warnings:

  - Added the required column `user_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ON_WAY', 'DONE', 'CANCELED', 'FAILED');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CANCEL';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'DELIVERY_BOY';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Delivery" (
    "delivery_id" TEXT NOT NULL,
    "delivery_boy" INTEGER NOT NULL,
    "delivery_status" "DeliveryStatus" NOT NULL,
    "delivery_price" DECIMAL(65,30) NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "delivery_date" TIMESTAMP(3),

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("delivery_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" TEXT NOT NULL,
    "feedback_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback_user" INTEGER NOT NULL,
    "feedback_text" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_boy_fkey" FOREIGN KEY ("delivery_boy") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_feedback_user_fkey" FOREIGN KEY ("feedback_user") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
