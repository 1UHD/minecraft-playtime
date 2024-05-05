use std::fs;
use std::path::PathBuf;
use std::io::{BufReader, BufRead};
use flate2::read::GzDecoder;
use std::fs::File;

fn read_log_files(directory_path: &str) -> Result<(), String> {
    let dir = PathBuf::from(directory_path);

    // Iterate over the directory entries
    for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_path = entry.path();

        // Check if it's a file and ends with .log.gz
        if file_path.is_file() && file_path.extension().map_or(false, |ext| ext == "log.gz") {
            println!("Reading file: {:?}", file_path);

            // Open the file
            let file = File::open(&file_path).map_err(|e| e.to_string())?;
            let reader = BufReader::new(GzDecoder::new(file));

            // Read the first and last lines
            let mut first_line = String::new();
            let mut last_line = String::new();

            for line in reader.lines() {
                let line = line.map_err(|e| e.to_string())?;
                if first_line.is_empty() {
                    first_line = line.clone();
                }
                last_line = line;
            }

            println!("First Line: {}", first_line);
            println!("Last Line: {}", last_line);
        }
    }

    Ok(())
}

fn main() {
    if let Err(err) = read_log_files("/Users/kurt/.lunarclient/offline/multiver/logs") {
        eprintln!("Error: {}", err);
    }
}
