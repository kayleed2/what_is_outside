USE what_is_outside;

LOAD DATA LOCAL INFILE 'jopColors'
INTO TABLE color_elements
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

UPDATE main_data SET title = SUBSTRING(title,2) WHERE title LIKE '"%';
UPDATE main_data SET title = SUBSTRING(title, 1, LENGTH(title)-1) WHERE title LIKE '%"';

UPDATE color_elements SET colors = REPLACE(REPLACE(colors, '\r', ''), '\n', '');