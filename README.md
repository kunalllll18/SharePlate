# 🌱 SharePlate — Surplus Food Rescue Network 🍲

### ♻️ Turning Surplus Food into Shared Meals

**SharePlate** is a web-based food rescue platform that connects food donors — such as restaurants, college events, and caterers — with NGOs and volunteers who can collect and redistribute surplus food to people in need.

Our mission is simple: **Reduce food waste. Share more meals. Build a better future. 💚**

---

## ✨ Features

- 🍱 **Food Donation:** Share surplus food with details such as food name, quantity, donor, location, and collection deadline.
- 🔎 **Find Available Food:** Browse available food donations and discover nearby opportunities.
- 📍 **Search & Filter:** Find food listings using relevant details and location.
- 🤝 **Claim Food:** Allow users to claim available food for collection.
- ⏰ **Deadline Awareness:** Highlight time-sensitive donations to encourage timely collection.
- 🔐 **Authentication:** Backend endpoints for user authentication.
- 📱 **Responsive Design:** A modern interface designed for different screen sizes.
- 🗄️ **Database Support:** Store application data using MySQL through the Spring Boot backend.

---

## 🎯 Problem Statement

Every day, edible food can go to waste at restaurants, events, and catering services while people in nearby communities face food insecurity.

SharePlate aims to bridge this gap by providing a centralized platform where donors can list surplus food and verified organizations or volunteers can coordinate its collection.

### 💡 Our Solution

✅ Make food donation easier and more organized.

✅ Help donors connect with people who can collect surplus food.

✅ Encourage timely collection through deadline-aware listings.

✅ Support sustainability by reducing avoidable food waste.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend user interface |
| ⚡ Vite | Frontend development and build tool |
| 🟨 JavaScript | Frontend logic |
| 🎨 HTML5 & CSS3 | Structure and styling |
| ☕ Java | Backend development |
| 🍃 Spring Boot | Backend APIs and application logic |
| 🔗 Spring Data JPA | Database access |
| 🐬 MySQL | Relational database |
| 📦 Maven | Backend build and dependency management |
| 🧪 Postman | API testing |
| 🐙 Git & GitHub | Version control and collaboration |

---

## 📂 Project Structure

```text
SharePlate/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/shareplate/backend/
│   │   │   │   ├── 📁 config/
│   │   │   │   ├── 📁 controller/
│   │   │   │   ├── 📁 exception/
│   │   │   │   ├── 📁 model/
│   │   │   │   ├── 📁 repository/
│   │   │   │   └── 📁 service/
│   │   │   └── 📁 resources/
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   └── 📄 mvnw
│
├── 📁 public/
├── 📁 src/
│   ├── 📁 assets/
│   ├── 📁 components/
│   ├── 📄 api.js
│   ├── 📄 App.jsx
│   ├── 📄 homepage.jsx
│   ├── 📄 App.css
│   ├── 📄 index.css
│   └── 📄 main.jsx
│
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 .gitignore
└── 📄 README.md
```

---

## 🚀 Getting Started

Follow these steps to run SharePlate locally.

### 📋 Prerequisites

Make sure you have installed:

- 🟢 [Node.js](https://nodejs.org/)
- ☕ [Java JDK](https://www.oracle.com/java/technologies/downloads/) compatible with the backend configuration
- 🐬 [MySQL](https://dev.mysql.com/downloads/)
- 🐙 [Git](https://git-scm.com/)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kunalllll18/SharePlate.git
cd SharePlate
```


### 2️⃣ Configure MySQL 🗄️

Create the database:

```sql
CREATE DATABASE shareplate;
```

Configure your local MySQL application user and grant it the required database privileges.

Set your database password in the terminal as an environment variable:

```bash
export DB_PASSWORD='YOUR_LOCAL_DATABASE_PASSWORD'
```

🔒 **Security tip:** Never commit actual database passwords, API keys, or other secrets to GitHub.

### 3️⃣ Run the Backend ☕

Open a terminal in the project directory:

```bash
cd backend
./mvnw spring-boot:run
```

The backend should run at:

🌐 `http://localhost:8080`

Check the health endpoint:

🔍 `http://localhost:8080/api/health`

Expected response:

```text
SharePlate backend is running!
```

### 4️⃣ Run the Frontend ⚛️

Open a **second terminal** in the project root directory:

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

🌐 `http://localhost:5173`

🎉 You're ready to explore SharePlate!

---

## 🔌 API Testing

Use [Postman](https://www.postman.com/) to test the backend endpoints.

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Check backend status |
| Food controller routes | Manage food listings |
| Authentication controller routes | Handle authentication requests |

📌 Refer to the controller classes in `backend/src/main/java/com/shareplate/backend/controller/` for the exact API routes and request formats.

---

## 🛣️ Future Enhancements

- 🧠 **Smart Food Matching:** Match donations by urgency, distance, and quantity.
- 🗺️ **Location-Based Discovery:** Help volunteers find nearby food donations.
- 👥 **Role-Based Access:** Support donors, NGOs, and volunteers with appropriate permissions.
- 🔔 **Real-Time Notifications:** Notify users about new donations and claim updates.
- 🥗 **Food Safety Workflows:** Improve food information, verification, and collection coordination.
- ☁️ **Cloud Deployment:** Make SharePlate accessible online.
- 🧪 **Automated Testing:** Expand backend and frontend test coverage.

---

## 🌍 Our Mission

> 💚 *“Good food deserves a destination, not a dustbin.”*

SharePlate aims to create a more sustainable and compassionate food ecosystem by helping surplus food reach the communities that need it.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

1. 🍴 Fork the repository.
2. 🌿 Create a feature branch.
3. 💻 Make your changes.
4. 📩 Submit a pull request.

---

## 📜 License

No license has been selected yet. A license can be added when the project is ready for public reuse.

---

### ⭐ Support SharePlate

If you like this initiative, consider giving the repository a ⭐ on GitHub!

**Let's reduce food waste, one meal at a time. 🌱🍲💚**
