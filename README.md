# MERN Auth Frontend

This is the frontend of a simple authentication system built using React. It allows users to sign up, log in, verify their email via OTP, and reset their password.

## Features
- User authentication (Login & Signup)
- Email verification via OTP
- Password reset functionality
- Responsive and modern UI with Tailwind CSS

## Tech Stack
- **React.js** - Frontend framework
- **React Router** - Navigation management
- **Axios** - HTTP requests to backend
- **React Toastify** - Notifications & alerts
- **Tailwind CSS** - Styling

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/mernauth-frontend.git
cd mernauth-frontend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your backend URL:
```sh
VITE_BACKEND_URL=http://localhost:5000  # Change this to your backend URL
```

### 4. Run the Development Server
```sh
npm run dev
```
The app will start on `http://localhost:5173/`.

## Folder Structure
```
mernauth-frontend/
│── src/
│   ├── assets/          # Images & static assets
│   ├── components/      # Reusable UI components
│   ├── context/         # Global state management
│   ├── pages/           # App pages (Login, Signup, Reset Password, etc.)
│   ├── routes/          # Routing configuration
│   ├── App.js           # Main app component
│   ├── main.js          # React entry point
│── public/              # Public files
│── .env                 # Environment variables
│── package.json         # Dependencies & scripts
│── README.md            # Project documentation
```

## API Endpoints Used
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/send-reset-otp` | POST | Send OTP for password reset |
| `/api/auth/reset-password` | POST | Reset user password |
| `/api/auth/verify-email` | POST | Verify email via OTP |

## Contributing
Feel free to fork this repository and contribute to the project!

## License
This project is licensed under the **MIT License**.

