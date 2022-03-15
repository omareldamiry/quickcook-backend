-- AlterTable
ALTER TABLE `ingredient` MODIFY `type` ENUM('unlisted', 'dairy', 'meat', 'vegetable', 'fruit', 'spice', 'oil', 'grain', 'pasta') NOT NULL DEFAULT 'unlisted';
