var connectionString =  '';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;


var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var connectCallback = function(err) {
    if(err){
        console.log('Não foi possível conectar: ' + err);
    }else{
        console.log('Cliente conectado');
    }
}

client.open(connectCallback);


setInterval(function(){
    // Simulação de telemetria.
    var temperature = 20 + (Math.random() * 15);
    var message = new Message(JSON.stringify({
      deviceId: 'SensorHumidade',
      temperature: temperature,
      humidity: 60 + (Math.random() * 20)
    }));
  
    // Inclusão de propriedade de aplicativo customizado na mensagem.
    // Um hub IoT pode filtrar essas propriedades sem acesso ao corpo da mensagem.
    message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
  
    console.log('Envie a mensagem: ' + message.getData());
  
    // Envie a mensagem.
    client.sendEvent(message, function (err) {
      if (err) {
        console.error('enviar erro: ' + err.toString());
      } else {
        console.log('mensagem enviada');
      }
    });
  }, 5000);
