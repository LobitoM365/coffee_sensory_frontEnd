import axios from "axios";

export default axios.create({
    baseURL : "http://192.168.18.94:3000/api",
    withCredentials : true
}) 