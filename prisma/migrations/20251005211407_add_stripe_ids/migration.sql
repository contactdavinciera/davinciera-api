/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutSessionId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_stripeCheckoutSessionId_key" ON "enrollments"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_stripePaymentIntentId_key" ON "enrollments"("stripePaymentIntentId");
