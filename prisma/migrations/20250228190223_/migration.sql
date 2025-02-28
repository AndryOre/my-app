/*
  Warnings:

  - You are about to drop the column `parentId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropIndex
DROP INDEX "Category_parentId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentId";
