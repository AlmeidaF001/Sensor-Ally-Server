const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let client;
let sensorsData = {}; // Armazena dados dos sensores

app.post('/connect', (req, res) => {
    const { appId, apiKey } = req.body;

    if (client) {
        client.end();
    }

    client = mqtt.connect('mqtt://eu1.cloud.thethings.network', {
        username: appId,
        password: apiKey,
    });

    client.on('connect', () => {
        console.log('✅ Conectado ao MQTT');

        const topic = `#`; // Inscreve-se corretamente nos tópicos TTN
        client.subscribe(topic, (err) => {
            if (err) {
                console.error('Erro ao inscrever-se no tópico:', err);
            } else {
                console.log(`📡 Inscrito no tópico ${topic}`);
            }
        });

        res.send({ status: 'Conectado ao MQTT' });
    });

    client.on('error', (err) => {
        console.error('❌ Erro de conexão MQTT:', err);
        res.status(500).send({ status: 'Erro ao conectar', error: err.message });
    });

    client.on('message', (topic, message) => {
        console.log('📩 Mensagem recebida:', topic);
        try {
            const receivedData = JSON.parse(message.toString());

            if (receivedData.uplink_message && receivedData.uplink_message.decoded_payload) {
                const decodedPayload = receivedData.uplink_message.decoded_payload;

                // Extrai o deviceId corretamente do tópico
                const topicParts = topic.split('/');
                const deviceId = topicParts[3]; // Obtém o ID do dispositivo corretamente

                sensorsData[deviceId] = decodedPayload;

                console.log(`✅ Dados atualizados (${deviceId}):`, sensorsData[deviceId]);
            }
        } catch (error) {
            console.error('❌ Erro ao processar a mensagem:', error);
        }
    });

    client.on('close', () => {
        console.log('⚠️ Conexão MQTT fechada');
    });
});

// Rota para obter os dados dos sensores
app.get('/sensor-data', (req, res) => {
    res.json(sensorsData);
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
