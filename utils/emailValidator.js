export const validateIITBhilaiEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/;
    return regex.test(email);
};