import { UnitExams, exams } from "./exam.interface"; // Make sure this is correct
import * as bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import * as fs from "fs";

// Initialize the exams array, ensure it's typed correctly
let examData: exams = loadExams();

// Function to load exams from the JSON file
function loadExams(): exams {
    try {
        const data = fs.readFileSync("./exams.json", "utf-8");
        const parsedData: exams = JSON.parse(data);

        // Ensure examsArray is correctly typed
        if (!parsedData.examsArray) {
            parsedData.examsArray = []; // Ensure we don't get undefined
        }

        return parsedData;
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

// Update an existing exam by ID
export const update = async (examId: string, updatedExamData: Partial<UnitExams>): Promise<UnitExams | null> => {
    // Find the exam by ID
    const examIndex = examData.examsArray.findIndex(exam => exam.id === examId);

    if (examIndex === -1) {
        return null; // If no exam with the given ID is found, return null
    }

    // Get the current exam data
    const existingExam = examData.examsArray[examIndex];

    // Update the exam fields
    if (updatedExamData.username) existingExam.username = updatedExamData.username;
    if (updatedExamData.email) existingExam.email = updatedExamData.email;
    if (updatedExamData.password) {
        // Hash the new password before updating
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updatedExamData.password, salt);
        existingExam.password = hashedPassword;
    }

    // Save the updated exams data to the file
    saveExams();

    return existingExam; // Return the updated exam
};
