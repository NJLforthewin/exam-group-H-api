export interface exam {
    username : string,
    email : string,
    password : string
}

export interface UnitExams extends exam {
    id : String
}

export interface exams {
    [ key : string ] : UnitExams
}