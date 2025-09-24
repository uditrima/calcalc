// WebSocket service for real-time updates
let socket = null;
let eventHandlers = new Map();

/**
 * Initialize WebSocket connection
 * @param {string} url - WebSocket server URL (default: ws://localhost:5000)
 * @returns {WebSocket} - The WebSocket instance
 */

const SOCKET_BASE_URL =
  window.location.hostname === "localhost"
    ? "ws://localhost:5000"
    : "wss://calcalc.onrender.com";


export function initSocket(url = SOCKET_BASE_URL) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }
    
    try {
        socket = new WebSocket(url);
        
        // Set up event listeners
        socket.addEventListener('open', (event) => {
            console.log('WebSocket connected:', event);
            const handlers = eventHandlers.get('open') || [];
            handlers.forEach(handler => handler(event));
        });
        
        socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);
                
                // Call generic message handlers
                const messageHandlers = eventHandlers.get('message') || [];
                messageHandlers.forEach(handler => handler(data, event));
                
                // Call specific event handlers
                if (data.type && eventHandlers.has(data.type)) {
                    const typeHandlers = eventHandlers.get(data.type) || [];
                    typeHandlers.forEach(handler => handler(data.payload, event));
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });
        
        socket.addEventListener('close', (event) => {
            console.log('WebSocket disconnected:', event);
            const handlers = eventHandlers.get('close') || [];
            handlers.forEach(handler => handler(event));
        });
        
        socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            const handlers = eventHandlers.get('error') || [];
            handlers.forEach(handler => handler(event));
        });
        
        return socket;
    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        throw error;
    }
}

/**
 * Register event handler
 * @param {string} eventType - Event type ('open', 'close', 'error', 'message', or custom type)
 * @param {Function} handler - Handler function
 */
export function onSocketEvent(eventType, handler) {
    if (!eventHandlers.has(eventType)) {
        eventHandlers.set(eventType, []);
    }
    eventHandlers.get(eventType).push(handler);
}

/**
 * Remove event handler
 * @param {string} eventType - Event type
 * @param {Function} handler - Handler function to remove
 */
export function offSocketEvent(eventType, handler) {
    if (eventHandlers.has(eventType)) {
        const handlers = eventHandlers.get(eventType);
        const index = handlers.indexOf(handler);
        if (index > -1) {
            handlers.splice(index, 1);
        }
    }
}

/**
 * Send data through WebSocket
 * @param {string} type - Message type
 * @param {any} payload - Data to send
 */
export function emitSocketEvent(type, payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
            type: type,
            payload: payload,
            timestamp: new Date().toISOString()
        };
        socket.send(JSON.stringify(message));
    } else {
        console.warn('WebSocket not connected. Cannot send message.');
    }
}

/**
 * Get current WebSocket connection state
 * @returns {number} - WebSocket readyState
 */
export function getSocketState() {
    return socket ? socket.readyState : WebSocket.CLOSED;
}

/**
 * Close WebSocket connection
 */
export function closeSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

/**
 * Reconnect WebSocket
 * @param {string} url - WebSocket server URL
 */
export function reconnectSocket(url = 'ws://localhost:5000') {
    closeSocket();
    return initSocket(url);
}
