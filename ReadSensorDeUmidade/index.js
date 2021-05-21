var connectionString =  'HostName=SensorHumidade.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=3ViBvVM32qHfpVLamTYJwRLkME9jmO3C/cKrqfGWcj8=';



var { EventHubClient, EventPosition  } = require('azure-event-hubs');

var printError = function (err) {
  console.log(err.message);
};


var printMessage = function (message) {
  console.log('Telemetria recebida ');
  console.log(JSON.stringify(message.body));
  console.log('');
};


var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("O EventHub Client foi criado com sucesso a partir da string de conexão do IoT Hub.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
    
  return ids.map(function (id) {
    console.log('Criar receptor de partição: ' + id);
    return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
}).catch(printError);
