-- ============================================================
-- Run this in phpMyAdmin AFTER uploading files to /shop/
-- This updates product image paths to include the /shop/ prefix
-- ============================================================

UPDATE products SET image = CONCAT('/shop', image) WHERE image NOT LIKE '/shop%' AND image != '';
UPDATE products SET box_image = CONCAT('/shop', box_image) WHERE box_image NOT LIKE '/shop%' AND box_image != '' AND box_image IS NOT NULL;