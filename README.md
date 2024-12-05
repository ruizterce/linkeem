# Linkeem

Linkeem is a social media platform where users can share posts, interact with others through likes and comments, and build connections through followers. This project is built using modern web technologies, aiming to provide an engaging and responsive user experience.

---

## 🚀 Features

- **User Authentication**:

  - Implemented with **Passport.js** and **JWT** for secure login and registration.
  - Password hashing using **bcrypt** to ensure secure storage.

- **Social Features**:

  - Post creation with support for **text** and **images** (using **multer** for file uploads).
  - Users can like and comment on posts, fostering engagement.
  - Follow and unfollow other users to build personalized connections.

- **User Profiles**:

  - Each user has a profile that includes their posts, followers, following, and interactions.
  - Profile customization with the ability to update profile information and pictures.

- **Feed**:

  - Infinite scrolling to load posts dynamically, enhancing user experience.

- **Backend API**:

  - Built with **Express.js** to handle routing and user data.
  - **Prisma** ORM for database management, ensuring efficient queries and migrations.
  - **CORS** enabled for cross-origin requests and handling multiple frontend sources.

- **Responsive Design**:

  - Optimized for both web and mobile, thanks to **TailwindCSS** and **Ionic React**.
  - Mobile-first design approach ensuring smooth ensuring smooth UI across devices.

---

## 🛠️ Technologies Used

### Frontend

- **React**: The core library for building the user interface.
- **Ionic React**: Used for mobile-first UI components and easy integration with native mobile features.
- **Capacitor**: Enables mobile capabilities like handling the keyboard, status bar, and haptic feedback.
- **TailwindCSS**: For fast, responsive, and highly customizable styling.
- **Axios**: For making HTTP requests to the backend API.
- **React Router**: Used for client-side routing and navigation between pages.

### Backend

- **Express.js**: The server framework for handling API routes and user data.
- **Passport.js**: Used for authentication and authorization, supporting local strategy with JWT.
- **Prisma ORM**: A modern database toolkit to interact with the PostgreSQL or MySQL database.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Bcrypt**: For hashing user passwords securely before storing them in the database.
- **Multer**: For handling file uploads, such as images attached to posts.
- **CORS**: Middleware for enabling cross-origin resource sharing (CORS) between the frontend and backend.
- **dotenv**: For managing environment variables such as API keys and database credentials.

---

## 📝 License

This project is licensed under the GPL-3.0 license.
