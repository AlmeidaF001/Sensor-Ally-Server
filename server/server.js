const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Variáveis globais para conexão MQTT e armazenamento de dados
let client;
let sensorData = null; // Mantém os últimos valores válidos

// Conectar ao broker MQTT
app.post('/connect', (req, res) => {
    const { appId, apiKey } = req.body;

    if (client) {
        client.end(); // Fecha conexão anterior antes de iniciar uma nova
    }

    client = mqtt.connect('mqtt://eu1.cloud.thethings.network', {
        username: appId,
        password: apiKey,
    });

    client.on('connect', () => {
        console.log('✅ Conectado ao broker MQTT');
        client.subscribe('#', (err) => {
            if (err) {
                console.error('Erro ao inscrever-se no tópico:', err);
            } else {
                console.log('📡 Inscrito no tópico MQTT');
            }
        });
        res.send({ status: 'Conectado ao broker MQTT' });
    });

    client.on('error', (err) => {
        console.error('❌ Erro de conexão MQTT:', err);
        res.status(500).send({ status: 'Erro ao conectar', error: err.message });
    });

    client.on('message', (topic, message) => {
        console.log('📩 Mensagem recebida:', topic);
        try {
            const receivedData = JSON.parse(message.toString());

            // Verifica se a mensagem contém os dados esperados
            if (receivedData.uplink_message && receivedData.uplink_message.decoded_payload) {
                const decodedPayload = receivedData.uplink_message.decoded_payload;

                // Garante que os dados são válidos antes de atualizar
                if (decodedPayload[""]) {
                    sensorData = decodedPayload[""];
                    console.log('✅ Dados atualizados:', sensorData);
                } else {
                    console.log('⚠️ Dados inválidos recebidos, mantendo os valores anteriores.');
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

// Rota para buscar os dados do sensor
app.get('/sensor-data', (req, res) => {
    if (!sensorData) {
        return res.status(204).send({ message: 'Sem novos dados ainda' });
    }
    res.json(sensorData);
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
