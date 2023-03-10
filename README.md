# Foodly

Foodly is my university project for the course "Database Applications". It is a platform, where users can order food from the imaginary restaurant. The whole project is written in Typescript. Currently, the project is in development. I am planning to add more features in the future. And I am also planning to add a mobile application for the project. And yes, I am crazy.

Please do not judge me for the code. I am not a backend developer and I believe that I can violate some best practices. If you want to help me, you can create an issue or a pull request. More info about this is in the [Issues](#issues) section.

## Technologies

1. Backend
   - Nest.js. It is a backend framework for Node.js. It is written in Typescript and inspired by Angular. More info [here](https://nestjs.com/)
   - Prisma. It is an ORM (but I think it is more than that). More info [here](https://www.prisma.io/)
   - PostgreSQL. It is a relational database. More info [here](https://www.postgresql.org/)
   - Swagger. It is a tool for API documentation. More info [here](https://swagger.io/)

2. Frontend
    - ReactJS. It is a frontend UI library (according to their website). More info [here](https://beta.reactjs.org/)
    - Next.js. It is a framework built on top of ReactJS. More info [here](https://nextjs.org/)
    - TailwindCSS. It is a utility-first CSS framework. More info [here](https://tailwindcss.com/)

## Prerequisites

Before you start, make sure you have installed all of the following prerequisites on your development machine:

- Node.js - Download and Install [Node.js](https://nodejs.org/en/) and the npm package manager. Preferably the latest LTS version.
- PostgreSQL - Download and Install [PostgreSQL](https://www.postgresql.org/download/). Make sure that you have created a database and a user with all privileges on that database.

## Installation

After you have installed all of the prerequisites, you can install the project. To do so, follow the steps below:

- Clone the repository. You can do it by running the following command in your terminal:

```bash
git clone (URL of the repository)
```

- Install the dependencies. You can do it by running the following command in the root directory of the project:

```bash
npm run backend:install
npm run frontend:install
```

- After the installation of the dependencies, you need to create a `.env` file in the backend directory of the project. You need to the following variables in the file:

```bash
PORT= # The port on which the backend will run
DATABASE_URL=postgresql://(username):(password)@(host):(port)/(database name)?schema=public # It is for the database connection
VERIFY_SECRET_KEY # It is for the email verification token
ACCESS_SECRET_KEY # It is for the access token
REFRESH_SECRET_KEY # It is for the refresh token
EMAIL_PROVIDER # It is for the email provider. Suggest to use Yandex. They do not require any verification of the account, like phone number.
EMAIL_PROVIDER_USER # Email of the provider account. For example, test@yandex.com
EMAIL_PROVIDER_PASSWORD # Password of the provider account
```

- After you have created the `.env` file in the backend directory, you need to change the `.env.development` file in the frontend directory of the project. You need to verify the following variables in the file:

```bash
NEXT_PUBLIC_API_URL= # The URL of the backend. For example, http://localhost:8000
```

- After all these steps are done, you can run the migrations. You can do it by running the following command in the root directory of the project:

```bash
npm run backend:migrate
```

- After the migrations are done, you can run the project. You can do it by running the following command in the root directory of the project:

```bash
npm run backend:dev
npm run frontend:dev
```

- Have fun!

## Issues

If you have any issues with the project, you can create an issue in the repository. If you know how to fix the issue, you can create a pull request. I will be happy to review it and thank you for your contribution.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details. If you want to use this project for your own purposes, you can do it. But I would be happy if you mention me in your project and star the repository :)

## Contact

If you want to contact me, you can reach me at [my email](mailto:azizbektemirov64@gmail.com). I will be happy to answer your questions or ignore them :D
