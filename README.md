# URL Shortener Backend

A production-ready URL Shortener backend built with Spring Boot 3, PostgreSQL, Redis, and JWT Authentication.

## Features

- **User Authentication**: Secure registration and login with JWT.
- **Link Management**: Create, update, delete, and list short links.
- **Advanced Features**: Custom aliases, QR code generation, expiration dates.
- **High Performance**: Redis caching for fast redirection and rate limiting.
- **Analytics**: Detailed click tracking (IP, User Agent, Location, Device).
- **Security**: Stateless JWT auth, CORS configuration, password hashing.

## Tech Stack

- Java 17
- Spring Boot 3.2+
- PostgreSQL (Database)
- Redis (Caching & Rate Limiting)
- JWT (Authentication)
- Lombok (Boilerplate reduction)
- ZXing (QR Code generation)

## Setup Instructions

### Prerequisites

- Java 17 Development Kit (JDK)
- Docker (optional, for running DB/Redis locally)
- PostgreSQL running locally or remotely
- Redis running locally or remotely
- Maven

### Environment Variables

Create a `.env` file or set the following environment variables:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/urlshortener
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key_at_least_32_chars_long
FRONTEND_URL=http://localhost:5173
```

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd urlshortener-backend
   ```

2. **Run PostgreSQL and Redis:**
   If you have Docker, you can run:
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
   docker run --name redis -d -p 6379:6379 redis
   ```

3. **Configure Database:**
   Ensure the database `urlshortener` exists.
   ```bash
   docker exec -it postgres createdb -U postgres urlshortener
   ```

4. **Build and Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   Or with environment variables inline:
   ```bash
   DATABASE_URL=jdbc:postgresql://localhost:5432/urlshortener \
   DATABASE_USERNAME=postgres \
   DATABASE_PASSWORD=password \
   REDIS_URL=redis://localhost:6379 \
   JWT_SECRET=changeit \
   mvn spring-boot:run
   ```

The server will start on `http://localhost:8080`.

## API Documentation

Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT

### Links
- `POST /api/links` - Create a short link (Requires Auth)
- `GET /api/links` - Get all user links (Requires Auth)
- `PUT /api/links/{id}` - Update a link (Requires Auth)
- `DELETE /api/links/{id}` - Delete a link (Requires Auth)

### Redirection
- `GET /{shortCode}` - Redirect to original URL (Public)

### Analytics
- `GET /api/analytics/{linkId}` - Get analytics for a link (Requires Auth)

## Deployment (Render.com)

1. **Create a new Web Service** on Render.
2. **Connect your Git repository**.
3. **Select Environment**: `Docker` or `Java` (Maven).
   - If using Maven native:
     - Build Command: `mvn clean package -DskipTests`
     - Start Command: `java -jar target/urlshortener-backend-0.0.1-SNAPSHOT.jar`
4. **Add Environment Variables**:
   - `DATABASE_URL` (Use Render PostgreSQL internal URL)
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `REDIS_URL` (Use Render Redis internal URL)
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `PORT`: `8080`
5. **Deploy**.

## License
MIT
