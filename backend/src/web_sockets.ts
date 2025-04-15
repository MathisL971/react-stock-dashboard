import WebSocket, { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

// Web Socket client to subscribe to real-time updates on Finnhub

const finnhubSubscriptions = new Set<string>(); // Keep track of tickers subscribed to Finnhub

const socket = new WebSocket('wss://ws.finnhub.io?token=' + process.env.FINNHUB_API_KEY);

socket.addEventListener('open', function () {
    console.log('Connected to Finnhub WebSocket API');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Received API message:', event.data);

    if (typeof event.data !== 'string') {
        console.error('Received non-string data:', event.data);
        return;
    }

    const data = JSON.parse(event.data);
    
    if (data.type === 'trade') {
        data.data.forEach((trade: { s: string; p: number; }) => {
            const symbol = trade.s;
            const price = trade.p;
            // Forward the price update to all clients subscribed to this symbol
            for (const [client, clientSubscription] of subscriptions.entries()) {
                if (clientSubscription === symbol && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'price_update', symbol: symbol, price: price }));
                }
            }
        });
    }
});

socket.addEventListener('close', function () {
    console.log('Connection closed');
})

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

// Web Socket server to gather client subscriptions

const wss = new WebSocketServer({ port: 8080 });

const subscriptions = new Map<WebSocket, string>();

wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'system', message: 'Connected for real-time updates.' }));
    subscriptions.set(ws, "");

    ws.on('message', async message => {
        try {
            const parsedMessage = JSON.parse(message.toString());

            console.log('Received client message:', parsedMessage);

            if (parsedMessage.type === 'subscribe' && parsedMessage.symbol) {
                if (subscriptions.has(ws)) {
                    const currentSubscription = subscriptions.get(ws);

                    if (currentSubscription) {                    
                        subscriptions.set(ws, "");

                        let stillSubscribed = false;
                        // If no other client are subscribed to the same ticker, unsubscribe
                        for (const clientSubscription of subscriptions.values()) {
                            if (clientSubscription === currentSubscription) {
                                stillSubscribed = true;
                                break;
                            }
                        }

                        if (!stillSubscribed && finnhubSubscriptions.has(currentSubscription)) {
                            // Unsubscribe from the current subscription
                            socket.send(JSON.stringify({'type':'unsubscribe', 'symbol': currentSubscription}))
                            finnhubSubscriptions.delete(currentSubscription);
                            console.log(`Unsubscribed from Finnhub for: ${currentSubscription}`);
                        }
                    }
                }

                const symbol = parsedMessage.symbol.toUpperCase();
                subscriptions.set(ws, symbol);
                console.log(`Client subscribed to: ${symbol}`);

                if (!finnhubSubscriptions.has(symbol)) {
                    socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}))
                    finnhubSubscriptions.add(symbol);
                    console.log(`Subscribed to Finnhub for: ${symbol}`);
                }
            } else {
                console.log('Received unknown message:', parsedMessage);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message.' }));
        }
    });

    ws.on('close', () => {
        if (subscriptions.has(ws)) {
            const currentSubscription = subscriptions.get(ws);

            if (currentSubscription) {                    
                subscriptions.set(ws, "");

                let stillSubscribed = false;
                // If no other client are subscribed to the same ticker, unsubscribe
                for (const clientSubscription of subscriptions.values()) {
                    if (clientSubscription === currentSubscription) {
                        stillSubscribed = true;
                        break;
                    }
                }

                if (!stillSubscribed && finnhubSubscriptions.has(currentSubscription)) {
                    // Unsubscribe from the current subscription
                    socket.send(JSON.stringify({'type':'unsubscribe', 'symbol': currentSubscription}))
                    finnhubSubscriptions.delete(currentSubscription);
                    console.log(`Unsubscribed from Finnhub for: ${currentSubscription}`);
                }
            }        
            
            subscriptions.delete(ws);        
            console.log('Client disconnected');
        }
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
        subscriptions.delete(ws);
    });
});

console.log('WebSocket server started on port 8080 for real-time updates.');

