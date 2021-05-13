Pass `API_URL`, `CB_KEY`, `CB_SECRET`, `CB_PASSPHRASE` as env variables or add them in an `.env` file.

```
node src/trader.js buy <base> <quote> <amount> [max_price] 
```

## Docker

Update `cron.conf` as needed.

Build image and run:
```
docker build -t dca-coinbase .
docker run -d --name dca-co   inbase -e TZ=Europe/Bucharest -e API_URL='https://api.pro.coinbase.com' -e CB_KEY='' -e CB_SECRET='' -e CB_PASSPHRASE='' dca-coinbase
```
