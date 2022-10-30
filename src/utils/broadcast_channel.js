import { BroadcastChannel } from 'broadcast-channel';

const channelName = 'broadcastChannel';

export const sendMessage = (data = {}) => {
  const channel = new BroadcastChannel(channelName);
  channel.postMessage(data);
};

export const onMessage = (type, callback) => {
  const channel = new BroadcastChannel(channelName);
  channel.onmessage = (data) => {
    if (type != data.type) return;

    callback(data);
  };
};
