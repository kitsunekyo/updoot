# development

- create an `.env` file in the project root.
- add your database connection string as `DATABASE_URL="mysql://user:pw@host"` (i used [planetscale](https://planetscale.com/) as a cheap/free cloud sql db)
- run `npx prisma db push` to push the db schema
- run `npm run dev` to start the dev server
