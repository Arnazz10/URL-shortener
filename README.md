
# Spring Boot URL Shortener

A production-ready URL Shortener featuring a Spring Boot backend and a modern React + Vite frontend

##  Features

-   **Shorten URLs**: Instant link shortening with unique aliases.
-   **Custom Aliases**: Create vanity URLs (e.g., `qlnk.io/my-brand`).
-   **Analytics**: Track clicks, geographic locations, device types, and more
-   **QR Codes**: Auto-generated QR codes for every link.
-   **Security**: Password protection for sensitive links
-   **Expiration**: Set expiry dates for temporary links.
-   **Rate Limiting**: Protection against abuse.
-   **Modern UI**: Glassmorphism design with Dark Mode support (coming soon).

## 🛠 Tech Stack

**Backend:**
-   Java 17
-   Spring Boot 3.2
-   Spring Data JPA (PostgreSQL)
-   Spring Data Redis (Caching & Rate Limiting)
-   Spring Security + JWT
-   Lombok, ZXing (QR Codes)

**Frontend:**
-   React 18
-   Vite
-   TailwindCSS
-   Recharts (Analytics)
-   Lucide React (Icons)
-   React Hook Form

**DevOps:**
-   Docker & Docker Compose

## 🏃‍♂️ Local Development

### Prerequisites
-   Docker & Docker Compose
-   Java 17 (optional, if running locally without Docker)
-   Node.js 18+ (for frontend)

### Quick Start (Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Arnazz10/URL-shortener.git
    cd URL-shortener
    ```

2.  **Start Backend & Databases:**
    ```bash
    docker-compose up -d --build
    ```
    This starts PostgreSQL, Redis, and the Spring Boot API.
    -   API: `http://localhost:8080`
    -   Swagger Docs: `http://localhost:8080/swagger-ui.html`

3.  **Start Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    -   Frontend: `http://localhost:5173`

---

## 🌍 Deployment

### Option 1: Render.com (Recommended)

This project includes a `render.yaml` Blueprint for easy deployment.

1.  Fork/Clone this repo to your GitHub.
2.  Sign up for [Render.com](https://render.com).
3.  Go to **Blueprints** -> **New Blueprint Instance**.
4.  Connect your repository.
5.  Render will automatically detect the `render.yaml` and set up:
    -   PostgreSQL Database
    -   Redis Instance
    -   Backend Service (Docker)
    -   Frontend Static Site

**Environment Variables to set in Render Dashboard (if not auto-detected):**
-   `JWT_SECRET`: Generate a strong random string.
-   `VITE_API_URL`: The URL of your deployed Backend Service (e.g., `https://url-shortener-api.onrender.com/api`).

### Option 2: Docker / VPS

Build and run the container:
```bash
docker build -t urlshortener-backend .
docker run -p 8080:8080 -e DATABASE_URL=... -e REDIS_URL=... urlshortener-backend
```

## 📚 API Documentation

Once running, full OpenApi 3.0 documentation is available at:
`http://localhost:8080/swagger-ui.html`

## 🔒 Security

-   **JWT Authentication**: Stateless authentication for scalability.
-   **Password Hashing**: BCrypt for secure password storage.
-   **Rate Limiting**: Redis-based limiting to prevent abuse.
