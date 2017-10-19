export function getPriceData () {
 return fetch('https://api.coinmarketcap.com/v1/ticker/?limit=1000');
}

export function getCoinData (id) {
 return fetch('https://api.coinmarketcap.com/v1/ticker/' + id + '/');
}
