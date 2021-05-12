Pass `API_URL`, `CB_KEY`, `CB_SECRET`, `CB_PASSPHRASE` as env variables or add them in an `.env` file.

```
node src/trader.js buy <base> <quote> <amount> [max_price] 
```

## Docker

Update `cron.conf`

```
docker build -t dca-coinbase .
docker run -d --name dca-coinbase -e TZ=Europe/Bucharest -e API_URL=<> -e CB_KEY=<> -e CB_SECRET=<> -e CB_PASSPHRASE=<> dca-coinbase
```
