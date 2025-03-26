import { exam, UnitExams, exams } from "./exam.interface";
import * as bcrypt from 'bcryptjs';
import { v4 as random } from "uuid";
import * as fs from 'fs';

let examsData: exams = loadExams();

function loadExams(): exams {
    try {
        const data = fs.readFileSync("./exams.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error: ${error}`);
        return {};
    }
}

function saveExams() {
    try {
        fs.writeFileSync("./exams.json", JSON.stringify(examsData), "utf-8");
        console.log("Exams saved successfully!");
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

export const findAll = async (): Promise<UnitExams[]> => Object.values(examsData);

export const findOne = async (id: string): Promise<UnitExams> => examsData[id];

export const create = async (examData: UnitExams): Promise<UnitExams | null> => {
    let id = random();
    let check_exam = await findOne(id);

    while (check_exam) {
        id = random();
        check_exam = await findOne(id);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(examData.password, salt);

    const exam: UnitExams = {
        id: id,
        username: examData.username,
        email: examData.email,
        password: hashedPassword,
    };

    examsData[id] = exam;

    saveExams();

    return exam;
};

export const findByEmail = async (exam_email: string): Promise<null | UnitExams> => {
    const allExams = await findAll();
    const getExam = allExams.find(result => exam_email === result.email);

    if (!getExam) {
        return null;
    }

    return getExam;
};

export const comparePassword = async (email: string, supplied_password: string): Promise<null | UnitExams> => {
    const exam = await findByEmail(email);
    if (!exam) return null;

    const decryptPassword = await bcrypt.compare(supplied_password, exam.password);

    if (!decryptPassword) {
        return null;
    }

    return exam;
};

export const update = async (id: string, updateValues: exam): Promise<UnitExams | null> => {
    const examExists = await findOne(id);

    if (!examExists) {
        return null;
    }

    if (updateValues.password) {
        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(updateValues.password, salt);
        updateValues.password = newPass;
    }

    examsData[id] = {
        ...examExists,
        ...updateValues,
    };

    saveExams();

    return examsData[id];
};

export const remove = async (id: string): Promise<null | void> => {
    const exam = await findOne(id);

    if (!exam) {
        return null;
    }

    delete examsData[id];

    saveExams();
};
