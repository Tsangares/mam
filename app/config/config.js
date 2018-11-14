var config = {};

config.ENABLED = true;
config.TIME_INTERVAL = 1;

config.PROVIDER = "https://nodes.testnet.iota.org:443";
config.SEED = "FKSVZT9DBOBDFDFVDD9DSVXVCDS9DJKZPANDA9NAMKDAKBDALDISKIASSBGUTCVZD9ABSMBAKXGACDA99";
config.CHANNELMODE = "restricted";
config.AUTHORISATION_KEY = "iotamailbox";
config.SECURITY_LEVEL = 1;

config.MICROSECONDS_PER_CM = 1e6/34321;
config.GPIO_TRIGGER_PIN = 23;
config.GPIO_ECHO_PIN = 24;

module.exports = config;