const { read_log_file } = require("./log_reader");
const os = require("os");

path = os.homedir() + "/.lunarclient/offline/multiver/logs";
path2 = "/Users/kurt/Library/Application Support/minecraft/logs"

let beer = read_log_file(path2);
console.log(`Beer: ${beer}`)