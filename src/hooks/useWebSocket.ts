import { useEffect, useRef, useState } from "react";

type WebSocketOptions = {
    onOpen: (event: Event) => void;
    onMessage: (event: MessageEvent) => void;
    onClose: (event: CloseEvent) => void;
    onError: (error: Event) => void;
};

const SERVER_URL = "ws://localhost:8080";

function useWebSocket(options: WebSocketOptions) {
    const { onOpen, onMessage, onClose, onError } = options;
    const websocket = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        websocket.current = new WebSocket(SERVER_URL);
        setIsConnected(websocket.current.readyState === WebSocket.OPEN);

        websocket.current.onopen = (event) => {
            setIsConnected(true);
            onOpen(event)
        };

        websocket.current.onclose = (event) => {
            setIsConnected(false);
            onClose(event)
        };
    
        websocket.current.onmessage = (event) => {
            onMessage(event)
        };
        
        websocket.current.onerror = (error) => {
            onError(error)
        };
        
        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                console.log(`Closing WebSocket connection`);
                websocket.current.close();
            }
        }
    }, [onOpen, onMessage, onClose, onError]);

    const send = (data: string) => {
        if (websocket.current && isConnected) {
            websocket.current.send(data);
        }
    }

    return { websocket, isConnected, send}
}

export default useWebSocket;