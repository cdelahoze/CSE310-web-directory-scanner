# Overview

As a software development, my goal with this project is to deepen my understanding of modern full-stack web application development using React and Next.js. Specifically, I set out to bridge backend file-system operations—developed in TypeScript—with a dynamic, responsive web interface using Next.js Server Actions, full-stack routing, and file management services.

This web application is an interactive directory scanner and file manager called **TakTaim Web Explorer**. It allows users to dynamically scan any folder on the server, inspect the full directory tree structure in real time, view overall storage analytics, and upload files directly to the server's storage system (`./uploads`).

To run the application on your local computer:

1. Open your terminal in the project root directory and install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your web browser and navigate to:
   ```text
   http://localhost:3000
   ```

My primary purpose for writing this software was to master full-stack web architecture, server-side asynchronous file scanning, dynamic URL routing, and seamless client-server interaction without relying on heavy external backend frameworks.

[Software Demo Video](https://youtu.be/jLnXmoiETz8)
[GitHub Repository](https://github.com/cdelahoze/CSE310-web-directory-scanner.git)

# Web Pages

The application consists of three dynamic web pages designed for intuitive navigation and data exploration:

* **Main Explorer Page (`/`)**: Serves as the primary dashboard. It features an interactive text input where users can type any server directory path (e.g., `./src` or `./uploads`) to initiate an instant scan. It also includes a file upload form that saves files directly to `./uploads`. The page dynamically renders summary cards (total files, total directories, total size) and an interactive recursive directory tree. Clicking on any individual file redirects the user to its dedicated inspection page.
* **Storage Analytics Page (`/analytics`)**: Focuses exclusively on analyzing the `./uploads` directory. It dynamically scans the server's upload folder upon page load and presents clean metric cards summarizing subdirectories, total uploaded files, and accumulated storage consumption. A navigation button allows easy return to the main explorer.
* **File Inspector Page (`/files/[filename]`)**: A dynamic route generated on the fly based on the selected file name passed through the URL parameter (`[filename]`). It fetches file system metadata dynamically using Node.js `fs.stat` and displays detailed information including exact file size (in bytes and KB), extension, creation date, and absolute server path.

# Development Environment

The following tools and environment were used during development:

* **Visual Studio Code**: Primary Integrated Development Environment (IDE).
* **Node.js & npm**: JavaScript runtime environment and package manager.
* **Git & GitHub**: Version control and code repository hosting.

**Programming Languages, Frameworks, and Libraries:**
* **TypeScript**: Strongly typed language used for both backend scanner logic and frontend UI components.
* **Next.js (App Router & Server Actions)**: Full-stack React framework utilized for server-side rendering, dynamic routing, and server-side execution.
* **React**: UI library for building interactive component hierarchies.
* **Tailwind CSS & Custom CSS**: Used for modern, responsive dark-themed user interface styling.

# Useful Websites

* [Next.js Documentation](https://nextjs.org/docs)
* [React Documentation](https://react.dev)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)

# Future Work

* Integrate SQLite or PostgreSQL database persistence using Prisma ORM to keep long-term historical records of directory scans and user uploads.
* Add user authentication (NextAuth.js) to provide private file storage spaces per user.
* Implement file deletion and renaming capabilities directly from the Web Explorer interface.