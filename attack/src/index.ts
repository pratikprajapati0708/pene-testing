const axios = require('axios');
let data = JSON.stringify({
  "email": "kpratik23@gmail.com",
  "otp": "359628",
  "newPassword": "test@123456"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:3000/reset-password',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
