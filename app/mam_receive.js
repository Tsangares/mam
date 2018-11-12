const Mam = require('../lib/mam.node.js')
const IOTA = require('iota.lib.js');
const config = require('./config/config');
const moment = require('moment');

const iota = new IOTA({ provider: config.PROVIDER });

let root;
let key;

// Check the arguments
const args = process.argv;
if(args.length !=3) {
    console.log('Missing root as argument: node mam_receive.js <root>');
    process.exit();
} else if(!iota.valid.isAddress(args[2])){
    console.log('You have entered an invalid root: '+ args[2]);
    process.exit();
} else {
    root = args[2];
}

// Initialise MAM State
let mamState = Mam.init(iota);

// Set channel mode
if (config.CHANNELMODE == 'restricted') {
    key = iota.utils.toTrytes(config.AUTHORISATION_KEY);
    mamState = Mam.changeMode(mamState, config.CHANNELMODE, key);
} else {
    mamState = Mam.changeMode(mamState, config.CHANNELMODE);
}

// Receive data from the tangle
const executeDataRetrieval = async function(rootVal, keyVal) {
  try {
    let resp = await Mam.fetch(rootVal, config.CHANNELMODE, keyVal, function(data) {
      let json = JSON.parse(iota.utils.fromTrytes(data));
      var time =  moment().utc().format('hh:mm:ss');
      console.log(`${time} | dateTime: ${json.dateTime}, data: ${json.data}`);
  });
    executeDataRetrieval(resp.nextRoot, keyVal);
  } catch (e) {
    console.error("executeDataRetrieval ", e);
  }
};

executeDataRetrieval(root, key);