/*
  Warnings:

  - You are about to drop the column `recipeId` on the `ingredient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ingredient` DROP FOREIGN KEY `Ingredient_recipeId_fkey`;

-- AlterTable
ALTER TABLE `admin` ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ingredient` DROP COLUMN `recipeId`;

-- CreateTable
CREATE TABLE `_IngredientToRecipe` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_IngredientToRecipe_AB_unique`(`A`, `B`),
    INDEX `_IngredientToRecipe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD FOREIGN KEY (`A`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD FOREIGN KEY (`B`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
