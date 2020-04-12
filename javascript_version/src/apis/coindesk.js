import axios from 'axios'

export default axios.create({
  baseURL: "https://api.coindesk.com/v1/bpi",
});