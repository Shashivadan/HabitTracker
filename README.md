# Habit Tracker API

This API allows users to create, manage, and track habits. Users can log daily completions for habits and retrieve or delete habits as needed.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Create a New Habit](#create-a-new-habit)
  - [Log Completion for a Habit](#log-completion-for-a-habit)
  - [Get All Habits](#get-all-habits)
  - [Delete a Habit](#delete-a-habit)
- [Running Tests](#running-tests)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/habit-tracker-api.git
   cd habit-tracker-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## Usage

You can use tools like `Postman` or `curl` to interact with the API.

### Example: Create a Habit

```bash
curl -X POST http://localhost:3000/habits \
-H "Content-Type: application/json" \
-d '{
  "name": "Exercise",
  "description": "Daily morning workout",
  "target_days_per_week": 5
}'
```

### Example: Log Completion for a Habit

```bash
curl -X POST http://localhost:3000/habits/:id/log \
-H "Content-Type: application/json" \
-d '{
  "date": "2024-08-23"
}'
```

## API Endpoints

### Create a New Habit

- **URL:** `/habits`
- **Method:** `POST`
- **Body Parameters:**

  - `name` (string): Name of the habit.
  - `description` (string): Description of the habit.
  - `target_days_per_week` (number): Target days per week for the habit.

- **Success Response:**

  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "id": "123",
      "name": "Exercise",
      "description": "Daily morning workout",
      "target_days_per_week": 5,
      "completed_days": []
    }
    ```

- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:** `"400 Bad Request: Invalid input data"`

### Log Completion for a Habit

- **URL:** `/habits/:id/log`
- **Method:** `POST`
- **URL Parameters:**

  - `id` (string): The habit's unique identifier.

- **Body Parameters:**

  - `date` (string): The date of completion in `YYYY-MM-DD` format.

- **Success Response:**

  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": "123",
      "date": "2024-08-23",
      "message": "Completion logged successfully."
    }
    ```

- **Error Responses:**

  - **Code:** 400 Bad Request
  - **Content:** `"400 Bad Request: Invalid date format."`

  - **Code:** 404 Not Found
  - **Content:** `"404 Not Found: Habit not found."`

  - **Code:** 409 Conflict
  - **Content:** `"409 Conflict: Completion already logged for this date."`

### Get All Habits

- **URL:** `/habits`
- **Method:** `GET`

- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "habits": [
        {
          "id": "123",
          "name": "Exercise",
          "description": "Daily morning workout",
          "target_days_per_week": 5,
          "completed_days": [
            {
              "date": "2024-08-23"
            }
          ]
        }
      ],
      "total": 1
    }
    ```

### Delete a Habit

- **URL:** `/habits/:id`
- **Method:** `DELETE`
- **URL Parameters:**

  - `id` (string): The habit's unique identifier.

- **Success Response:**

  - **Code:** 200 OK
  - **Content:** `"Habit deleted successfully."`

- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:** `"Habit not found."`
