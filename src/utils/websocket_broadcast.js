import { snakeToCamelCase } from '@/utils/object.js';
import { blankFunc } from '@/utils/lang';

export const establish_ws_broadcast_channel = (
  onOpen = blankFunc,
  onMessage = blankFunc,
  onClose = blankFunc,
  onError = blankFunc
) => {
  console.log('Starting connection to WebSocket Server');
  let socket = new WebSocket(process.env.VUE_APP_BACKEND_WS_URL);

  socket.onopen = function () {
    console.log('[open] Connection established');
    onOpen(socket);
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    onMessage(snakeToCamelCase(data));
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`[onclose] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[onclose] Connection died');
    }

    console.log('[onclose] Trying to re-connect');
    establish_ws_broadcast_channel(onOpen, onMessage);
    onClose(event);
  };

  socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
    onError(error);
  };
};
