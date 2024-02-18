interface iUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    pwd: string;
}

interface iTicker {
    symbol: string,
    symbolName: string,
    buy: number,
    bestBidSize: number,
    sell: number,
    bestAskSize: number,
    changeRate: number,
    changePrice: number,
    high: number,
    low: number,
    vol: number,
    volValue: number,
    last: number,
    averagePrice: number,
    takerFeeRate: number,
    makerFeeRate: number,
    takerCoefficient: number,
    makerCoefficient: number
}

interface iCryptoPrices {
    time: number,
    ticker: iTicker[],
}

interface iPostgresDB {
    id: number,
    symbol: string,
    last_price: string,
    timestamp: Date
}

interface iHistoryPrice {
    price: string,
    timestamp: string
}


export { iUser, iTicker, iCryptoPrices, iPostgresDB }