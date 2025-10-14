import { io } from 'socket.io-client'

export const initSocket = async () => {
    const option = {
        'force new connection': true,
        transports: ['websocket'],
        reconnectionAttempts: 'Infinity',
        timeout: 10000,        
    }

    // For Vite projects, use import.meta.env; for CRA, process.env is available
    // The backend URL should be explicitly defined or correctly retrieved from environment variables.
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:4000'; // Default to localhost:4000 if not set
    return io(backendUrl, option);   
}