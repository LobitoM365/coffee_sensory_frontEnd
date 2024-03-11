import axios from "axios";

export default axios.create({
    // baseURL : "http://10.193.129.44:3000/api",  
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

// export const host = '10.193.129.44'; 
export const host = 'localhost'; 