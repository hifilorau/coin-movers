export function getPriceData () {
 return fetch('https://api.coinmarketcap.com/v1/ticker/?limit=1000');
}
