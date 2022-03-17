import mongoose from 'mongoose'

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
} = global.Config

const auth = MONGO_USER && MONGO_PASSWORD ? MONGO_USER + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' : ''

const dbURI = `mongodb://${auth}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

mongoose.connect(dbURI, {
})
  .then(() => {
    console.log('connected db')
  })
  .catch((e : any) => {
    console.log(e)
  })