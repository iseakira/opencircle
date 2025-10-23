show tables;
DESCRIBE test;
select * from test;
select avg(value) as 平均値, max(value) as 最大値, min(value) as 最小値, sum(value) as 合計値 from test;
select avg(value)  from test where value >= 70;

select name from classA
union
select name from classB;
select a.name from classA a inner join classB b on a.name = b.name;
select a.name from classA a left join classB b on a.name = b.name where b.name is null;

insert into score(student_id, subject, score) values(6323073,'Database', 100);
select * from score;