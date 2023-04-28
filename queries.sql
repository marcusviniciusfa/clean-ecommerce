-- Active: 1680880545588@@127.0.0.1@5432@clean_ecommerce

drop table items;
drop table orders;
drop table coupons;
drop table products;

-- product

create table products (
  id integer,
  description text,
  price numeric,
  width integer,
  height integer,
  depth integer,
  weight numeric,
  currency text
);

insert into products (id, description, price, width, height, depth, weight, currency) values (1, 'a', 5000, 100, 30, 10, 3, 'BRL');
insert into products (id, description, price, width, height, depth, weight, currency) values (2, 'b', 1000, 50, 50, 50, 22, 'BRL');
insert into products (id, description, price, width, height, depth, weight, currency) values (3, 'c', 30, 10, 10, 10, 0.9, 'BRL');
insert into products (id, description, price, width, height, depth, weight, currency) values (4, 'd', 30, -10, 10, 10, 0.9, 'BRL');
insert into products (id, description, price, width, height, depth, weight, currency) values (5, 'b', 1000, 50, 50, 50, 22, 'USD');

-- coupon

create table coupons (
  code text,
  percentage numeric,
  expires_at timestamp
);

insert into coupons (code, percentage, expires_at) values ('VALE20', 20, now() + interval '1 year');
insert into coupons (code, percentage, expires_at) values ('BLACKFRIDAY', 50, now() - interval '1 year');

-- orders

create table orders (
  id text,
  cpf text,
  code text,
  total numeric,
  freight numeric
);

-- items: relação entre order e product

create table items (
  id_order text,
  id_product integer,
  price numeric,
  quantity integer
);
