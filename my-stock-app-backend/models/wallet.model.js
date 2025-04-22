const mongoose = require("mongoose")
const WalletSchema = mongoose.Schema({
  balance :{
    type: Number,
    required: true
  }
});

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;