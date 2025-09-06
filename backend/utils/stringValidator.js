function validateString(str){
    const trimmed = str.trim();
    const onlyLetters = /^[A-Za-z\s]+$/;
    return onlyLetters.test(trimmed);
}

export default validateString;