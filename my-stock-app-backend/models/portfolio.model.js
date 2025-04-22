const mongoose = require("mongoose")
const PortfolioSchema = mongoose.Schema({
  name :{
    type: String,
    required: true
  },
  quantity:{
    type: Number,
    required: true
  },
  totalCost:{
    type: Number,
    required: true
  }
});

const Portfolio = mongoose.model('portfolio', PortfolioSchema);

module.exports = Portfolio;
// const PortfolioSchema = {
//   name: 'portfolio'
// }

// module.exports= PortfolioSchema;
