const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let clients = {}; // Armazena clientes MQTT por usuário
let sensorsData = {}; // Armazena dados dos sensores por usuário

app.post('/connect', (req, res) => {
    const { appId, apiKey } = req.body;

    if (clients[appId]) {
        clients[appId].end();
    }

    clients[appId] = mqtt.connect('mqtt://eu1.cloud.thethings.network', {
        username: appId,
        password: apiKey,
    });

    clients[appId].on('connect', () => {
        console.log(`✅ Conectado ao MQTT para o usuário ${appId}`);

        const topic = `#`; // Inscreve-se corretamente nos tópicos TTN
        clients[appId].subscribe(topic, (err) => {
            if (err) {
                console.error('Erro ao inscrever-se no tópico:', err);
            } else {
                console.log(`📡 Inscrito no tópico ${topic}`);
            }
        });

        res.send({ status: 'Conectado ao MQTT' });
    });

    clients[appId].on('error', (err) => {
        console.error('❌ Erro de conexão MQTT:', err);
        res.status(500).send({ status: 'Erro ao conectar', error: err.message });
    });

    clients[appId].on('message', (topic, message) => {
        console.log('📩 Mensagem recebida:', topic);
        try {
            const receivedData = JSON.parse(message.toString());

            if (receivedData.uplink_message && receivedData.uplink_message.decoded_payload) {
                const decodedPayload = receivedData.uplink_message.decoded_payload;

                // Extrai o deviceId corretamente do tópico
                const topicParts = topic.split('/');
                const deviceId = topicParts[3]; // Obtém o ID do dispositivo corretamente

                if (!sensorsData[appId]) {
                    sensorsData[appId] = {};
                }

                sensorsData[appId][deviceId] = decodedPayload;

                console.log(`✅ Dados atualizados (${deviceId}) para o usuário ${appId}:`, sensorsData[appId][deviceId]);
            }
        } catch (error) {
            console.error('❌ Erro ao processar a mensagem:', error);
        }
    });

    clients[appId].on('close', () => {
        console.log(`⚠️ Conexão MQTT fechada para o usuário ${appId}`);
    });
});

// Rota para obter os dados dos sensores
app.get('/sensor-data', (req, res) => {
    const { appId } = req.query;
    res.json(sensorsData[appId] || {});
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});