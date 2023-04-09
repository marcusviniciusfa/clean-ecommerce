<h1 align="center">Clean E-Commerce</h1>

<p align="center">Projeto de E-Commerce criado com Clean Code e Clean Architecture</p>

## Passo a passo

1. `npm install` instale as dependências do projeto
2. crie a base de dados
3. `npm run ts-node:dev` faça a conexão do banco de dados e inicie o servidor
4. execute os testes


## Base de dados

### Docker

~~~sh
# inicia o container com um banco de dados postgres
docker compose up

# abre um pseudo terminal interativo para a execução de comandos dentro do container
docker container exec -it postgres /bin/bash

# abre a interface de comando do postgres, dentro do container, informando o usuário
psql -U clean_ecommerce

# verifica as tabelas criadas
\d
~~~

Utilize as queries SQL descritas no arquivo [queries.sql](./queries.sql) para criar os recursos necessários. Para facilitar a interação com o banco de dados utilize algum cliente como o [DBeaver Community](https://dbeaver.io/download/), ou uma extensão do vscode como [Database Client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-database-client2) e [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)

## Testes

~~~sh
# executa testes a exibe os resultados no navegador
npm run test:ui

# cria o diretório coverage com os resultados da cobertura de código
# abra o arquivo index.html presente no diretório coverage, no seu navegador de preferência, para visualizar os resultados
npm run test:coverage
~~~
