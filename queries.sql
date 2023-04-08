-- Active: 1680880545588@@127.0.0.1@5432@clean_ecommerce

create table products (
  id integer,
  description text,
  price numeric
);

insert into products (id, description, price) values (1, 'a', 5000);
insert into products (id, description, price) values (2, 'b', 1000);
insert into products (id, description, price) values (3, 'a', 30);

select * from products;

create table coupons (
  code text,
  percentage numeric
);

insert into coupons (code, percentage) values ('VALE20', 20);

select * from coupons;
