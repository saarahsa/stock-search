const mongoose = require("mongoose")
const WatchListSchema = mongoose.Schema({
  name :{
    type: String
  }
});

const WatchList = mongoose.model('watch_list', WatchListSchema);

module.exports = WatchList;
// const WatchListSchema = {
//   name: 'watch_list'
// }

// module.exports= WatchListSchema;