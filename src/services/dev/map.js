import io from 'socket.io-client';

const socket = io(`ws://${window.location.host}:8798`);

export function fetch(minLat, minLng, maxLat, maxLng, org, sn, user, statistic) {
  socket.emit('QUERY', { minLat, minLng, maxLat, maxLng, org, sn, user, statistic });
}

export function listenFetch(listener) {
  socket.on('QUERY_RET', listener);
}
