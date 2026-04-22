const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Notícias UPAON',
      version: '1.0.0',
      description: 'API para gerenciamento de notícias e regiões',
      contact: {
        name: 'Desenvolvedor'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor Local'
        }
      ]
    }
  },
  apis: ['./src/routes/*.js'] // Caminho onde estão os arquivos de rota com as anotações
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};
