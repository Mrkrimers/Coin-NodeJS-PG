# Coin-NodeJS-PG
Простой сервер, написанный с использованием библиотеки Express, который работает как cron-job сервис. Собирает информацию о последней цене пар всех криптовалют, доступных через KuCoin API. Сохраняет полученную информацию в Postgres базу данных в режиме реального времени с частотой раз в минуту. Хранит историю изменений цен по времени.

## Этот сервер разработан с использованием различных технологий:
* typescript: Язык программирования, предназначенный для разработки больших JavaScript-проектов.
* axios: HTTP-клиент для выполнения запросов к другим серверам.
* jsonwebtoken: Библиотека для создания и верификации JSON Web Tokens (JWT).
* bcrypt: Библиотека для хеширования паролей.
* node-cron: Планировщик задач для Node.js, позволяет выполнять задачи по расписанию.
* @types/dotenv: Позволяет использовать типы TypeScript для модуля dotenv, который загружает переменные среды из файла .env в процесс приложения.
* @types/node: Предоставляет типы TypeScript для Node.js.
* nodemon: Утилита для перезапуска сервера при изменениях файлов в проекте.
* pg: PostgreSQL клиент для Node.js.
* cors: Позволяет настраивать политику CORS (Cross-Origin Resource Sharing) для сервера Express.

## Установка
1. Клонировать репозиторий: https://github.com/Mrkrimers/Coin-NodeJS-PG.git
2. Перейти в директорию проекта: cd .\server\
3. Установить зависимости: npm install
4. В директории server cоздать файл с названием .env
5. После создания файла .env заполнить его следующими данными:
   PORT = 3001
   DB_PWD = (ваш пароль от postgres)
   DB_PORT = 5432
   DB_HOST = localhost
   DB_USER = postgres
   DATABASEFIRST = EducationPlatform
   DATABASESECOND = testcoin
7. Сервер подразумевает что уже созданы две базы данных (EducationPlatform и testcoin)
8. Если БД не созданы необходимо их создать в программе pgAdmin с названием "EducationPlatform" для первой БД и "testcoin" для второй БД.
   * После создания БД "EducationPlatform" необходимо добавить таблицу используя команду 
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	surname VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	pwd VARCHAR(30) NOT NULL,
);

   * После создания БД "testcoin" необходимо добавить таблицу используя команду: 
CREATE TABLE crypto_prices(
id SERIAL PRIMARY KEY,
	symbol VARCHAR(20) NOT NULL,
	last_price NUMERIC NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

## Запуск
1. Запустить сервер с помощью команды nodemon index
2. По умолчанию сервер будет доступен по адресу [http://localhost:3001]

## Использование
Сервер предоставляет несколько Endpoint для обработки различных запросов:
- `POST /api/register`: Endpoint для регистрации пользователя.
- `POST /api/auth`: Endpoint для авторизации пользователя и создания токена.

(Если пользователель авторизован будут доступны следующие Endpoint)
- `GET /api/crypto`: Endpoint для получения данных о последних ценах всех пар криптовалют.
- `GET /api/crypto/:id`: Endpoint для получения истории изменения цены конкретной пары криптовалют по её ID за период.

## Примеры запросов:
### Создание пользователя:
http://localhost:3000/api/register
в тело запроса в формате JSON добавить данные (например):
{
    "name": "test",
    "surname": "test",
    "email": "test@test.test",
    "pwd": "test"
}
### Авторизация пользователя:
http://localhost:3000/api/auth
в тело запроса в формате JSON добавить данные (например):
{
    "email": "test@test.test",
    "pwd": "test"
}
### Получение данных о последних ценах всех пар криптовалют:
http://localhost:3000/api/crypto
### Получить историю изменения цены конкретной пары криптовалют с идентификатором "3":
http://localhost:3001/api/crypto/3?start=2024-02-18T21:23:55&end=2024-02-18T21:45:03
