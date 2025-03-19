const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Variáveis globais para conexão MQTT e armazenamento de dados
let client;
let sensorsData = {}; // Armazenar dados dos dispositivos
let currentDeviceId = null; // Variável para armazenar o dispositivo atualmente selecionado

// Conectar ao broker MQTT
app.post('/connect', (req, res) => {
    const { appId, apiKey, deviceId } = req.body;

    if (client) {
        client.end(); // Fecha conexão anterior antes de iniciar uma nova
    }

    client = mqtt.connect('mqtt://eu1.cloud.thethings.network', {
        username: appId,
        password: apiKey,
    });

    client.on('connect', () => {
        console.log('✅ Conectado ao broker MQTT');
        
        if (deviceId) {
            currentDeviceId = deviceId;
            const topic = `sensor/${deviceId}/data`; // Inscreve no tópico do dispositivo específico
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error('Erro ao inscrever-se no tópico:', err);
                } else {
                    console.log(`📡 Inscrito no tópico do dispositivo ${deviceId}`);
                }
            });
            res.send({ status: `Conectado ao broker MQTT e inscrito no dispositivo ${deviceId}` });
        } else {
            res.status(400).send({ status: 'Erro', message: 'deviceId é necessário' });
        }
    });

    client.on('error', (err) => {
        console.error('❌ Erro de conexão MQTT:', err);
        res.status(500).send({ status: 'Erro ao conectar', error: err.message });
    });

    client.on('message', (topic, message) => {
        console.log('📩 Mensagem recebida no tópico:', topic);
        try {
            const receivedData = JSON.parse(message.toString());

            // Verifica se a mensagem contém os dados esperados
            if (receivedData.uplink_message && receivedData.uplink_message.decoded_payload) {
                const decodedPayload = receivedData.uplink_message.decoded_payload;

                // Extrai o deviceId do tópico
                const deviceId = topic.split('/')[1]; // Considerando que o ID está no segundo segmento do tópico

                if (deviceId === currentDeviceId) {
                    // Armazena os dados no objeto de sensores
                    sensorsData[deviceId] = decodedPayload;

                    console.log(`✅ Dados atualizados para o dispositivo ${deviceId}:`, sensorsData[deviceId]);
                }
            } else {
                console.log('⚠️ Mensagem não reconhecida, ignorando.');
            }
        } catch (error) {
            console.error('❌ Erro ao processar a mensagem:', error);
        }
    });

    client.on('close', () => {
        console.log('⚠️ Conexão MQTT fechada');
    });
});

// Rota para buscar os dados de um sensor específico
app.get('/sensor-data/:deviceId', (req, res) => {
    const { deviceId } = req.params;

    // Verifica se o deviceId é o mesmo que o selecionado
    if (deviceId !== currentDeviceId) {
        return res.status(400).send({ message: `Dispositivo selecionado não corresponde ao solicitado` });
    }

    if (!sensorsData[deviceId]) {
        return res.status(204).send({ message: `Sem dados para o dispositivo ${deviceId}` });
    }

    const deviceData = sensorsData[deviceId];

    res.json(deviceData); // Retorna todos os dados coletados para o dispositivo
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
