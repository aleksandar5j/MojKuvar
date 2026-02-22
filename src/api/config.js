import axios from 'axios'

const imageUrl = 'https://565q123.e2.mars-hosting.com/api/images/imagesview?rec_id='

const instance = axios.create({
  baseURL: 'https://565q123.e2.mars-hosting.com/api',
})

export default { instance, imageUrl }
