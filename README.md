# EATLY  
**Your Community Food Hub 🍽️✨**

Welcome to **Eatly**, a full-stack web application built for food lovers to **discover**, **share**, and **review** their favorite local eateries. More than just a directory, Eatly fosters a vibrant community centered around authentic food experiences.

**🔗 Live App**: [the-eatly.vercel.app](https://the-eatly.vercel.app)

---

## ✨ Features

- **User Authentication** 🔐 – Secure login and registration using **Passport.js**.
- **Create & Share** ✍️ – Users can post "food zones" with details about eateries they love.
- **Community Reviews** ⭐ – Add ratings and comments to help others make better food decisions.
- **Interactive Maps** 🗺️ – Each food zone is mapped with **Maptiler** for easy location access.
- **Smart Description AI** 🤖 – Integrated with **Gemini API** to polish user-written descriptions into clean, professional text.
- **Image Management** 📸 – Upload, resize, and optimize images using **Cloudinary**.
- **Responsive Design** 📱 – Built with **Bootstrap**, the platform looks great on all devices.

---

## 💻 Tech Stack

**Backend:**
- **Node.js** – JavaScript runtime used to build scalable server-side logic.
- **Express** – Lightweight web framework for routing and middleware.
- **MongoDB** – NoSQL database to store user data, reviews, and food zone details.
- **EJS** – Template engine to render dynamic HTML pages.
- **Passport.js** – Handles user authentication securely.
- **connect-mongo** – Stores session data in MongoDB for persistent logins.

**Frontend & Tools:**
- **Bootstrap** – Mobile-first UI framework for clean and responsive design.
- **Maptiler** – Provides customizable map tiles for displaying food zone locations.
- **Cloudinary** – Handles image uploads, resizing, and optimization.

**Security & Utilities:**
- **Helmet.js** – Sets secure HTTP headers to protect against common web vulnerabilities like XSS and clickjacking.
- **express-mongo-sanitize** – Prevents MongoDB Operator Injection (e.g., `$gt`, `$ne`) via user inputs.
- **connect-flash** – Displays temporary notifications like login success/error messages.


## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- Cloudinary account
- Maptiler account
- Gemini API key

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd eatly
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Set Environment Variables
```bash
touch .env
```
Then add,
```env
DB_URL=mongodb+srv://<username>:<password>@<cluster>/eatly?retryWrites=true&w=majority
SESSION_SECRET=<your_session_secret>
MONGO_SECRET=<your_mongo_secret>

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_KEY=<your_api_key>
CLOUDINARY_SECRET=<your_api_secret>

MAPTILER_API_KEY=<your_maptiler_key>
GEMINI_API_KEY=<your_gemini_key>
```
### 4. Start the application
```bash
npm install
```
### 🤝 Contributing
We welcome feature ideas, improvements, and bug fixes. Feel free to open an issue or pull request.
