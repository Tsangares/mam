const Mam = require('./lib/mam.node.js')
const IOTA = require('iota.lib.js');
const config = require('./config');
const moment = require('moment');

// Initialise tangle API
const iota = new IOTA({ provider: config.PROVIDER });

// Initialise MAM State
let mamState = Mam.init(iota, undefined, config.SECURITY_LEVEL);

// Set channel mode
if (config.CHANNELMODE == 'restricted') {
    const key = iota.utils.toTrytes(config.AUTHORISATION_KEY);
    mamState = Mam.changeMode(mamState, config.CHANNELMODE, key);
} else {
    mamState = Mam.changeMode(mamState, config.CHANNELMODE);
}

// Publish to tangle
const publish = async function(packet) {
    // Create MAM Payload
    const trytes = iota.utils.toTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // Save new mamState
    mamState = message.state;
    console.log('Root: ', message.root);
    console.log('Address: ', message.address);

    // Attach the payload.
    await Mam.attach(message.payload, message.address);

    return message.root;
};

const generateJSON = function() {
    // Generate some random numbers simulating sensor data
    const data = Math.floor((Math.random()*89)+10);
    const dateTime = moment().utc().format('DD/MM/YYYY hh:mm:ss');
    const json = {"data": data, "dateTime": dateTime};
    return json;
}

const executeDataPublishing = async function() {
    const json = generateJSON();
    console.log("json=",json);

    const root = await publish(json);
    console.log(`dateTime: ${json.dateTime}, data: ${json.data}, root: ${root}`);
}

// Start it immediately
executeDataPublishing();

setInterval(executeDataPublishing, 30000);