# Realtime Chat App

This project is a **Realtime Chat Application** built using **Next.js**. It supports real-time messaging between users, along with features like authentication, file uploads, and dynamic chat UI. The app leverages technologies like **Next.js**, **Prisma**, **Pusher**, **React**, and **Tailwind CSS** for an optimized and responsive experience.

## Features

- **Real-time Messaging:** Instant communication with other users in real-time using **Pusher**.
- **Authentication:** Secure user authentication via **NextAuth** with support for various providers.
- **File Uploads:** Image and file uploading powered by **Cloudinary**.
- **Dynamic UI:** Responsive and dynamic chat interface with support for user avatars, message status, and more.
- **User Management:** Manage your profile, connect with users, and explore previous conversations.
- **Data Persistence:** Data is stored using **Prisma** and **PostgreSQL** to ensure scalability and security.

## Tech Stack

- **Frontend:**

  - [React](https://reactjs.org/)
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/): For a clean and responsive design
  - [React Select](https://react-select.com/): For enhanced select inputs
  - [React Hook Form](https://react-hook-form.com/): Efficient form handling and validation
  - [React Hot Toast](https://react-hot-toast.com/): For beautiful and easy-to-use notifications

- **Backend:**

  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction): Server-side API routes for handling chat messages, authentication, and more.
  - [Prisma](https://www.prisma.io/): ORM for managing the database schema and migrations.
  - [Pusher](https://pusher.com/): For real-time features like message delivery.
  - [PostgreSQL](https://www.postgresql.org/): Database for secure and efficient data storage.

- **Authentication:**

  - [NextAuth](https://next-auth.js.org/): For seamless authentication with different providers.
  - **bcrypt**: Password hashing for secure user authentication.

- **Other Dependencies:**
  - **Axios**: For handling API requests.
  - **Lodash**: Utility functions for simplifying JavaScript code.
  - **Zustand**: State management library for simplified global state handling.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shadeshsaha/Socket.io-Practice.git
```

2. Navigate to the project folder:

```bash
cd realtime-chat-app
```

3. Install the dependencies:

```bash
npm install
```

4. Set up environment variables by creating a `.env` file in the root directory with the following keys:

```bash
DATABASE_URL=your_database_url
NEXTAUTH_URL=your_next_auth_url
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
CLOUDINARY_URL=your_cloudinary_url
```

5. Run the development server:

```bash
npm run dev
```

6. Open the app in your browser:

```
http://localhost:3000
```

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Runs the application in production mode.
- **`npm run lint`**: Runs ESLint to check for code issues.

## Database Setup

This project uses **Prisma** for managing the database. You can initialize the database with the following steps:

1. Run the Prisma migrations:

```bash
npx prisma migrate dev
```

2. To open the Prisma Studio for inspecting the database:

```bash
npx prisma studio
```

## Contributing

If you would like to contribute, feel free to create a pull request or open an issue on the repository.

## License

This project is licensed under the MIT License.

---

Feel free to add or modify the sections to suit your project! Let me know if you need further improvements.
