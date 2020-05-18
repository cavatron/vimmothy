# vimmothy

Further preserving the classics

## Usage

1. Install [Docker Desktop](https://www.docker.com/get-started) for your OS
2. Create a file in the project directory named `.env`, then set the following values:

  ```sh
  OUTPUT_DIR= # where to put the downloaded files
  RANGE=1,50 # range of files to download, inclusive
  BASE_URL= # the URL
  ```

3. Run `docker-compose up` in the project directory
4. ???
5. Profit

## Troubleshooting

If it hangs on launch, delete the output directory and try again. 
