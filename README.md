# SVU MCA Alumni Portal

The official digital platform for **Sri Venkateswara University MCA Department**, designed to bridge the gap between alumni and current students. This full-stack application facilitates mentorship, job opportunities, event management, and real-time networking.

## 🚀 Tech Stack

### Frontend (Client)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **State/Data**: React Context, SWR (planned)
- **Icons**: Lucide React

### Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.io (Chat & Notifications)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local / Multer (Images)

---

## ✨ Key Features

- **🔐 Role-Based Auth**: Distinct portals for **Students** and **Alumni**.
- **💼 Job Board**: Alumni can post job openings; Students can browse and apply.
- **📅 Events API**: Create, manage, and RSVP to department reunions and tech talks.
- **🔎 Alumni Directory**: distinct search and filter profile capabilities.
- **💬 Real-Time Chat**: Instant messaging between students and alumni powered by Socket.io.
- **🏆 Success Stories**: Showcase of distinguished alumni achievements.
- **📱 Responsive Design**: Fully optimized for mobile and desktop experiences.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas Connection String)

### 1. Clone the Repository

```bash
git clone https://github.com/Sreenivasulu-Kalluru/svu-mca-alumni-portal.git
cd svu-mca-alumni-portal
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the client folder:

```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory (optional for dev, defaults to localhost:5000):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Visit **<http://localhost:3000>** to view the app.

---

## 📂 Project Structure

```text
svu-mca-alumni-portal/
├── client/                 # Next.js Frontend
│   ├── src/app/            # App Router Pages
│   ├── src/components/     # Reusable UI Components
│   └── ...
├── server/                 # Express Backend
│   ├── src/controllers/    # Route Logic
│   ├── src/models/         # Mongoose Schemas
│   ├── src/routes/         # API Endpoints
│   └── ...
└── README.md               # Project Documentation
```

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
