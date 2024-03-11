import axios from "axios";

export const host = /* '10.193.129.44' */ "localhost";

export default axios.create({
    baseURL: "http://" + host + ":3000/api",
    /*  baseURL : "http://localhost:3000/api", */
    withCredentials: true
})

/* export const host = 'localhost'; */
