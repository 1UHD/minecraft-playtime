const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const stream = require("stream");

const time_regex = /\[(\d+:\d+:\d+)\]/;
let total_playtime = 0;

function time_to_epoch(time_string) {
    let [hours, minutes, seconds] = time_string[1].split(":").map(Number);
    let date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    let epoch = date.getTime();

    return epoch;
}

function epoch_to_time(epoch) {
    let totalSeconds = Math.floor(epoch / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const timeString = `${padZero(hours + 1)}:${padZero(minutes)}:${padZero(seconds)}`;

    return timeString;
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function read_log_file(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
      
        files.forEach(file => {
          if (file.endsWith('.log.gz')) {
            const filePath = path.join(directoryPath, file);
      
            // Read the gzipped file
            const gzip = zlib.createGunzip();
            const inputStream = fs.createReadStream(filePath);
            const outputStream = new stream.PassThrough();
      
            inputStream.pipe(gzip).pipe(outputStream);
      
            let firstMessage = null;
            let lastMessage = null;

            let start_seconds = null;
            let stop_seconds = null;
      
            outputStream.on('data', data => {
              const messages = data.toString().split('\n');
              if (firstMessage === null) {
                firstMessage = messages[0];
              }
              lastMessage = messages[messages.length - 2];
              //last_time = lastMessage.match(time_regex);
            });
      
            outputStream.on('end', () => {
                if (firstMessage && (first_time = firstMessage.match(time_regex))) {
                    start_seconds = time_to_epoch(first_time);
                }

                if (lastMessage && (last_time = lastMessage.match(time_regex))) {
                    stop_seconds = time_to_epoch(last_time);
                }

                if (start_seconds !== null && stop_seconds !== null) {
                    let spent_seconds = stop_seconds - start_seconds;
                    total_playtime += spent_seconds;
                    console.log(`Playtime for ${file} - ${epoch_to_time(spent_seconds)} - ${epoch_to_time(total_playtime)}`);
                } else {
                    console.log(`Unable to calculate playtime for ${file}`);
                }
            });
          }
        });

      });

      return total_playtime;
}

