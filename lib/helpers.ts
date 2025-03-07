export function validName(name: string) {
    if (!name || name === '') return false;

    return /^(?!.*\d)(?=.*[a-zA-Z]).*$/.test(name);
}

export function validEmail(email: string) {
    if (!email || email === '') return false;

    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}