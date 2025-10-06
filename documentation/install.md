# CampusLearn Installation Guide

## Prerequisites

- Windows 10/11
- Administrative access

## Step 1: Install Docker Desktop

### 1.1 Enable WSL in Windows Features

1. Open **Windows Features** (search for "Turn Windows features on or off")
2. Check the following features:
   - Windows Subsystem for Linux
   - Virtual Machine Platform
3. Click **OK** and restart your computer if prompted

### 1.2 Download Docker Desktop

1. Go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download Docker Desktop for Windows
3. Run the installer and follow the installation wizard
4. Start Docker Desktop and wait for it to fully initialize

## Step 2: Run Docker Compose

1. Open a terminal in the project root directory
2. Run the following command:
   ```bash
   docker compose up -d
   ```
3. Wait for the containers to start (postgres and pgadmin)

## Step 3: Connect to the Database in VS Code

1. Install the **PostgreSQL** extension in VS Code (by Chris Kolkman)
2. Click the PostgreSQL icon in the sidebar
3. Click **Add Connection**
4. Enter the connection details:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `campuslearn_db`
   - **Username**: `campuslearn_user`
   - **Password**: `campuslearn_password`
   - **Connection type**: PostgreSQL

   Or use this connection string:
   ```
   postgresql://campuslearn_user:campuslearn_password@localhost:5432/campuslearn_db
   ```

## Step 4: Run All SQL Scripts

Run the SQL scripts in the `database/` folder in the following order:

1. Open `database/01_schemas.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

2. Open `database/02_sequences.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

3. Open `database/03_tables.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

4. Open `database/04_constraints.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

5. Open `database/05_comments.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

6. Open `database/06_indexes.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

7. Open `database/07_functions.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

8. Open `database/08_views.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

9. Open `database/09_sample_data.sql`
   - Press `Ctrl+A` to select all
   - Press `Ctrl+Enter` to run

## Step 5: Install Dependencies

1. Locate and run `ZZ_Install.bat` in the project root
2. Wait for all npm packages to install

## Step 6: Run the Development Server

1. Locate and run `ZZ_Run_Server.bat` in the project root
2. The application will start:
   - Frontend (Next.js): [http://localhost:3000](http://localhost:3000)
   - Backend (Flask): [http://localhost:5000](http://localhost:5000)
   - pgAdmin: [http://localhost:8080](http://localhost:8080)

## Accessing pgAdmin

1. Navigate to [http://localhost:8080](http://localhost:8080)
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`

## Troubleshooting

### Docker containers not starting
- Make sure Docker Desktop is running
- Check the `.env` file exists and has correct credentials

### Database connection failed
- Verify Docker containers are running: `docker ps`
- Check connection details match those in `.env` file

### npm install fails
- Ensure Node.js is installed (version 18 or higher)
- Try deleting `node_modules` folder and running install again
