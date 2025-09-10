# RakStage

## 📂 Project Structure

```
RakStage/
├── client/                  # Frontend application
├── server/
│   ├── control_server/      # Core control backend
│   ├── interaction_server/  # Interaction/communication backend
│   └── ...
├── README.md
└── ...
```

---

## 🚀 Getting Started

### 1. Clone the Repository

Clone with all submodules:

```bash
git clone --recurse-submodules https://github.com/amrakk/RakStage.git
```

If you cloned without submodules, initialize them manually:

```bash
git submodule update --init --recursive
```

---

### 2. Install Dependencies

Install dependencies for all subprojects:

```bash
make bootstrap
```

---

### 3. Configure Environment

Initialize environment files for all subprojects:

```bash
make env-init
```

This will guide you through creating `.env` files interactively.

If needed, you can restore environment files from backups:

```bash
make restore-env
```

---

## 🏃 Running the Project

Run all services in development mode:

```bash
make dev
```

Run only the client:

```bash
make dev-client
```

Run only the servers:

```bash
make dev-server
```
