const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Port de Plaisance API',
            version: '1.0.0',
            description: 'API de gestion des réservations de catway pour le port de plaisance de Russell',
            contact: {
                name: 'Support',
                email: 'support@port-russell.fr'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Catway: {
                    type: 'object',
                    required: ['catwayNumber', 'catwayType', 'catwayState'],
                    properties: {
                        catwayNumber: {
                            type: 'number',
                            description: 'Numéro unique du catway'
                        },
                        catwayType: {
                            type: 'string',
                            enum: ['short', 'long'],
                            description: 'Type de catway (court ou long)'
                        },
                        catwayState: {
                            type: 'string',
                            description: 'État actuel du catway'
                        }
                    }
                },
                Reservation: {
                    type: 'object',
                    required: ['catwayNumber', 'clientName', 'boatName', 'startDate', 'endDate'],
                    properties: {
                        catwayNumber: {
                            type: 'number',
                            description: 'Numéro du catway réservé'
                        },
                        clientName: {
                            type: 'string',
                            description: 'Nom du client'
                        },
                        boatName: {
                            type: 'string',
                            description: 'Nom du bateau'
                        },
                        startDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date de début de réservation'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date de fin de réservation'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email de l\'utilisateur'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Mot de passe'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'user'],
                            description: 'Rôle de l\'utilisateur'
                        }
                    }
                },
                AdminLog: {
                    type: 'object',
                    required: ['action', 'timestamp'],
                    properties: {
                        action: {
                            type: 'string',
                            description: 'Action performed by the admin'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp of the action'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Message d\'erreur'
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        tags: [
            { name: 'Auth', description: 'Opérations d\'authentification' },
            { name: 'Catways', description: 'Gestion des catways' },
            { name: 'Reservations', description: 'Gestion des réservations' },
            { name: 'Users', description: 'Gestion des utilisateurs' },
            { name: 'Admin', description: 'Opérations d\'administration' }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};