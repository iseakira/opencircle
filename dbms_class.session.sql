-- 問１テーブル一覧(例題)とスキーマを確認してみよう
SHOW tables;

-- 問２学生テーブルの中身を10件だけ表示しよう
SELECT * FROM students LIMIT 10; 

-- 問３出席に存在するが、学生テーブルにいない学生番号を探せ
SELECT DISTINCT a.student_id
FROM attendance AS a
LEFT JOIN students AS s ON a.student_id = s.student_id
WHERE s.student_id IS NULL;

-- 問４出席に存在するが、講義テーブルに存在しない科目コードを探せ
SELECT DISTINCT a.course_id
FROM attendance AS a
LEFT JOIN courses AS c ON a.course_id = c.course_id
WHERE c.course_id IS NULL;

-- 問５履修に存在するが、講義テーブルに存在しない科目コードを探せ
SELECT DISTINCT e.course_id
FROM enrollment AS e
LEFT JOIN courses AS c ON e.course_id = c.course_id
WHERE c.course_id IS NULL;

-- 問６学生ごとの出席回数を求めよう
SELECT student_id, COUNT(*) AS attendance_count
FROM attendance
WHERE status = '出席'
GROUP BY student_id;

-- 問７学生ごとの出席回数を多い順に並べよう
SELECT student_id, COUNT(*) AS attendance_count
FROM attendance
WHERE status = '出席'
GROUP BY student_id
ORDER BY attendance_count DESC;

-- 問８出席回数が3回以上の学生を表示しよう
SELECT student_id, COUNT(*) AS attendance_count
FROM attendance
WHERE status = '出席'
GROUP BY student_id
HAVING attendance_count >= 3
ORDER BY attendance_count DESC;

-- 問９出席率を3段階で分類しよう
SELECT
    student_id,
    COUNT(*) AS attendance_count,
    CASE
        WHEN COUNT(*) >= 3 THEN '高出席'
        WHEN COUNT(*) >= 2 THEN '中出席'
        ELSE '低出席'
    END AS attendance_level
FROM attendance
WHERE status = '出席'
GROUP BY student_id
ORDER BY attendance_count DESC;

-- 問１０学生IDと名前を「〜さん」で連結して表示
SELECT
    student_id,
    CONCAT(name, 'さん') AS formatted_name
FROM students;
