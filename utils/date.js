const getDate = () =>{
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();    
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate.toString();
}
export default getDate();