import express from "express";
import { uuid } from "uuidv4";

const app = express();

app.use(express.json());

type Habit = {
  id: string;
  name: string;
  description: string;
  target_days_per_week: number;
  completed_days: { date: string }[];
};

const habits: Habit[] = [];

app.post("/habits", async (req, res) => {
  const { name, description, target_days_per_week } = await req.body;

  try {
    if (!name || !description || !target_days_per_week) {
      return res.status(400).send("Invalid input data");
    }

    if (target_days_per_week > 7 || target_days_per_week < 1) {
      return res.status(400).json({
        error: " Target days per week must be between 1 and 7.",
      });
    }

    if (habits.some((habit) => habit.name === name)) {
      return res.status(400).json({
        error: "Habit with this name already exists.",
      });
    }

    const id = uuid();

    habits.push({
      id,
      name,
      description,
      target_days_per_week,
      completed_days: [],
    });

    res.json({
      id,
      name,
      description,
      target_days_per_week,
      message: "Habit created successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: " Something went wrong." });
  }
});

app.post("/habits/:id/log", (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return res.status(400).json({ error: "Invalid date format." });
  }

  const habit = habits.find((habit) => habit.id === id);
  if (!habit) {
    return res.status(404).json({ error: "Habit not found." });
  }

  const dateExists = habit.completed_days?.some((entry) => entry.date === date);
  if (dateExists) {
    return res.status(409).json({
      error: "Completion already logged for this date.",
    });
  }

  habit.completed_days.push({ date });

  res.status(201).json({
    id: habit.id,
    date,
    message: "Completion logged successfully.",
  });
});

app.get("/habits", (req, res) => {
  res.json({
    habits,
    total: habits.length,
  });
});

app.delete("/habits/:id", (req, res) => {
  const id = req.params.id;
  const index = habits.findIndex((habit) => habit.id === id);
  if (index !== -1) {
    habits.splice(index, 1);
    res.json({ message: "Habit deleted successfully." });
  } else {
    res.status(404).json({ error: "Habit not found." });
  }
});

export default app;
