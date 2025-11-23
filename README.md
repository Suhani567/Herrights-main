# Herrights Project

<img width="1890" height="904" alt="image" src="https://github.com/user-attachments/assets/855b48ea-ad3e-419d-a158-9cfdc23eec7d" />


## Project Overview

Herrights is a full-stack web application designed to empower users with easy access to legal documents, community stories, FAQs, and legal resources. The platform features user authentication, document generation, and a rich community interface.

## Tech Stack

- **Backend:** Django (Python)
- **Frontend:** React.js with Vite bundler
- **Styling:** CSS (custom and library-based)
- **Build Tool:** Vite
- **Database:** Django default (likely SQLite or configured backend)
- **APIs:** RESTful APIs served by Django backend
- **Deployment:** Vercel configuration available (vercel.json)

## Features

- User authentication (login/signup)
- Document generation based on user inputs
- Community stories sharing and testimonials
- FAQ and Help pages for legal topics
- Responsive user interface with modern React components
- Wallet connect features for blockchain integrations (as indicated by web3 utilities)
- Multi-language support using Context API

## Project Preview

<img width="1877" height="874" alt="image" src="https://github.com/user-attachments/assets/cb98697a-a355-4d9c-8cb8-20c41a272c57" />
<img width="1870" height="790" alt="image" src="https://github.com/user-attachments/assets/fbeae9be-5549-46a0-8a2a-c63c2fcd7294" />



## How to Run

### Backend

1. Go to backend folder:
   ```bash
   cd herrights/herrights-backend
   ```
2. Set up Python virtual environment and activate it.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Navigate to frontend folder:
   ```bash
   cd herrights
   ```
2. Install node modules:
   ```bash
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Thank you for using Herrights!
