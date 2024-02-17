interface iCourse {
    id: number;
    cousre: string;
    description: string;
}

interface iUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    pwd: string;
}


export { iCourse, iUser }