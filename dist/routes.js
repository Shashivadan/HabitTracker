"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuidv4_1 = require("uuidv4");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const habits = [];
app.post("/habits", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, target_days_per_week } = yield req.body;
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
        const id = (0, uuidv4_1.uuid)();
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
    }
    catch (error) {
        res.status(500).json({ error: " Something went wrong." });
    }
}));
app.post("/habits/:id/log", (req, res) => {
    var _a;
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
    const dateExists = (_a = habit.completed_days) === null || _a === void 0 ? void 0 : _a.some((entry) => entry.date === date);
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
    }
    else {
        res.status(404).json({ error: "Habit not found." });
    }
});
exports.default = app;
