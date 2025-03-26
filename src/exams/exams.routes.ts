import { UnitExams, exams } from "./exam.interface";
import * as bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import * as fs from "fs";

// Initialize the exams array
let examData: exams = loadExams();

// Function to load exams from the JSON file
function loadExams(): exams {
    try {
        const data = fs.readFileSync("./exams.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error: ${error}`);
        return { examsArray: [] }; // Return an empty array if the file doesn't exist or there's an error
    }
}

// Function to save exams to the JSON file
function saveExams() {
    try {
        fs.writeFileSync("./exams.json", JSON.stringify(examData), "utf-8");
        console.log("Exams saved successfully!");
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

// Create a new exam and add it to the exams array
export const create = async (examData: UnitExams): Promise<UnitExams | null> => {
    const id = random();

    // Ensure the exam doesn't already exist (e.g., by email)
    const existingExam = examData.examsArray.find(exam => exam.email === examData.email);
    if (existingExam) {
        return null; // Exam with this email already exists
    }

    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(examData.password, salt);

    // Create the new exam object
    const newExam: UnitExams = {
        id,
        username: examData.username,
        email: examData.email,
        password: hashedPassword,
    };

    // Add the new exam to the exams array
    examData.examsArray.push(newExam);

    // Save the updated exams data to the file
    saveExams();

    return newExam; // Return the newly created exam
};

// Function to get all exams
export const findAll = async (): Promise<UnitExams[]> => {
    return examData.examsArray;
};
