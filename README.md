## 🛠 Setup Instructions

### 📦 Clone and Switch to Branch

If you haven't cloned the repo yet, run:

```bash
git clone -b amirtheswaran-cr https://github.com/amirtheswarann/reso.git
cd reso
```

To switch to the `amirtheswaran-cr` branch, run:
```bash
git fetch origin amirtheswaran-cr && git checkout amirtheswaran-cr
```

### 🔄 Follow `.env` Changes
- Ensure you follow the updates in:
  - `.env`
  - `./frontend/.env`
- Look for lines marked with `#TO CHANGE` and follow the instructions accordingly.

---

### 🐳 Docker Setup

1. Install **Docker** and **Docker Compose** on your system.
2. In the **root directory** of the project, run:

   ```bash
   docker compose build
   docker compose up
   ```
3. If you are facing any problem, run:

   ```bash
   docker compose build --no-cache
   docker compose up
   ```

4. go to the url [http://localhost:5173](http://localhost:5173) for the application.
5. go to the url [http://localhost:8000](http://localhost:8000) for the backend open api documentation