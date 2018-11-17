const Mam = require('../lib/mam.node.js')
const IOTA = require('iota.lib.js');
const config = require('./config/config');
const gpio = require('pigpio').Gpio;
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

// Initialise GPIO module
const trigger = new gpio(config.GPIO_TRIGGER_PIN, {mode: gpio.OUTPUT});
const echo = new gpio(config.GPIO_ECHO_PIN, {mode: gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low

// Publish to tangle
const publish = async (packet) => {
    console.info('publish');
    
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

const readSensor = async () => {
    console.info('readSensor');

    let startTick;
    await echo.on('alert', async (level, tick) => {
        console.info('sensor alert');
        if (level == 1) {
            startTick = tick;
        } else {
            const endTick = tick;
            const distance = ((endTick >> 0) - (startTick >> 0)) / 2 / config.MICROSECDONDS_PER_CM;
            const mail = distance <= 3;
            const data = `{distance: ${distance}, mail: ${mail}}`;
            const dateTime = moment().utc().format('DD/MM/YYYY hh:mm');
            const json = {
                "data": data, 
                "dateTime": dateTime
            };

            const root = await publish(json);
            console.log(`dateTime: ${json.dateTime}, data: ${json.data}, root: ${root}`);
        }
    });
};

const triggerSensor = async () => {
    console.info('triggerSensor');
    if (config.ENABLED == true)
        trigger.trigger(10, 1);
    else {
        const root = await publish(`${config.SENSORID} STOPPED`);
        clearInterval(interval);
    }
};

readSensor();

// Set a time interval between the reads
const interval = setInterval(triggerSensor, config.TIMEINTERVAL*1000);

