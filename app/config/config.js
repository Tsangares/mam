var Config = {};

Config.ENABLED = true;
Config.TIME_INTERVAL = 1;
// Config.PROVIDER = [
//     "https://node02.iotatoken.nl:443",
//     "https://turnip.iotasalad.org:14265",
//     "https://peanut.iotasalad.org:14265",
//     "http://node04.iotatoken.nl:14265",
//     "http://node05.iotatoken.nl:16265",
//     "https://nodes.thetangle.org:443",
//     "https://pow1.iota.community:443",
//     "https://pow2.iota.community:443",
//     "https://pow3.iota.community:443",
//     "https://trinity.iota-tangle.io:14265",
//     "http://iota1.heidger.eu:14265",
//     "https://nodes.iota.cafe:443",
//     "https://potato.iotasalad.org:14265",
//     "https://durian.iotasalad.org:14265",
//     "https://turnip.iotasalad.org:14265",
//     "https://nodes.iota.fm:443",
//     "https://tuna.iotasalad.org:14265",
//     "https://iotanode2.jlld.at:443",
//     "https://node.iota.moe:443",
//     "https://wallet1.iota.town:443",
//     "https://wallet2.iota.town:443",
//     "http://node03.iotatoken.nl:15265",
//     "https://node.iota-tangle.io:14265",
//     "https://pow4.iota.community:443",
//     "https://dyn.tangle-nodes.com:443",
//     "https://pow5.iota.community:443",
// ];
Config.PROVIDER = "https://wallet1.iota.town:443";
Config.CHANNELMODE = "restricted";
Config.AUTHORISATION_KEY = "iotamailbox";
Config.SECURITY_LEVEL = 1;

Config.GPIO_TRIGGER_PIN = 23;
Config.GPIO_ECHO_PIN = 24;

module.exports.config = Config;