// TODO : 
// - Maken the config a json file
const Mam = require("../lib/mam.client.js")
const { asciiToTrytes, trytesToAscii } = require("@iota/converter")
const Config = require("./config/config");
const Gpio = require("pigpio").Gpio;
const Moment = require("moment");

let attaching = false;
let distanceBuffer = 0;
let counter = 0;

// Initialise MAM State
let mamState = Mam.init(Config.PROVIDER);

// Set channel mode
mamState = Config.CHANNELMODE == "restricted" ? Mam.changeMode(mamState, Config.CHANNELMODE, Config.AUTHORISATION_KEY) : Mam.changeMode(mamState, Config.CHANNELMODE);

// Initialise GPIO module
const trigger = new Gpio(Config.GPIO_TRIGGER_PIN, {mode: Gpio.OUTPUT});
const echo = new Gpio(Config.GPIO_ECHO_PIN, {mode: Gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low

// Publish to tangle
const publish = async (packet) => {
    console.info("publish");
        
    // Create MAM Payload
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // Save new mamState
    mamState = message.state;
    console.info("Root: ", message.root);
    console.info("Address: ", message.address);

    // Attach the payload.
    await Mam.attach(message.payload, message.address, 3, 9);

    console.info("Published: ", packet, "\n");
    return message.root;
};

const readSensor = async () => {
    try {
        console.info("readSensor");
        attaching = true;
        let startTick;
        await echo.on("alert", async (level, tick) => {
            console.info("sensor alert");

            if (level == 1) 
                startTick = tick;
            else {
                const endTick = tick;
                const distance = ((endTick >> 0) - (startTick >> 0)) / 2 / (1e6/34321);
                console.info();
                if (persistentChangeDetected(distance)) {
                    const hasMail = distance <= 3;
                    const dateTime = Moment().utc().format("DD/MM/YYYY hh:mm");
                    const json = {
                        "distance": distance,
                        "hasMail": hasMail,
                        "dateTime": dateTime
                    };
                    const root = await publish(json);        
                }                
            }
        });
    } catch (e) {
        console.error("readSensor error: ", e.message);
    } finally {
        attaching = false;
    }
};

const persistentChangeDetected = (distance) => {
    let result = (distanceBuffer <= 3) != (distance <= 3);
    console.info("persistentChangeDetected: ", result);
    console.info("distance: ", distance);
    distanceBuffer = distance;
    return result;
};

const triggerSensor = async () => {
    console.info("triggerSensor");
    console.info("Interval ", count);
    
    if (Config.ENABLED)
        trigger.trigger(10, 1);
    else {
        const root = await publish(`${Config.SENSORID} STOPPED.`);
        clearInterval(interval);
    }
};

readSensor();
triggerSensor()

// Set a time interval between the reads
const interval = setInterval(() => { if(!attaching) { triggerSensor() } }, Config.TIME_INTERVAL * 1000);

