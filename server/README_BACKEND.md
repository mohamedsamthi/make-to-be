# Make To Be - Professional Backend Architecture

This backend follows the **Clean Architecture** pattern to ensure scalability, security, and maintainability.

## 🏗️ Folder Structure

- `/src`
  - `/config`: Database connections (Supabase).
  - `/controllers`: Request handlers (Business logic).
  - `/routes`: Endpoint definitions.
  - `/middleware`: Auth, Logging, Security.
  - `index.js`: Server entry point.

## 🚀 Getting Started

1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Production start: `npm start`

## 🔒 Security
- **Helmet**: Protects against common web vulnerabilities.
- **CORS**: Restricted origins for safe frontend-backend communication.
- **Dotenv**: Secure management of API keys.

## 📡 API Endpoints
- `GET /api/products`: Fetch all products.
- `GET /api/products/featured`: Fetch featured items.
- `GET /api/products/:id`: Get specific product details.
