/*
  Warnings:

  - You are about to alter the column `type` on the `ingredient` table. The data in that column could be lost. The data in that column will be cast from `Enum("ingredient_type")` to `Enum("Ingredient_type")`.

*/
-- AlterTable
ALTER TABLE `ingredient` MODIFY `type` ENUM('Unlisted', 'Dairy', 'Meat', 'Vegetable', 'Fruit', 'Spice', 'Oil', 'Grain', 'Pasta') NOT NULL DEFAULT 'Unlisted';
