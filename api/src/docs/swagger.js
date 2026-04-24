import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Em ESM, __dirname não existe — precisamos reconstruí-lo
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Notícias UPAON',
      version: '1.1.0',
      description: `API REST para gerenciamento de notícias da Ilha de São Luís (MA).

**Regiões suportadas**
| ID | Cidade |
|----|--------|
| 1  | São Luís |
| 2  | Raposa |
| 3  | Paço do Lumiar |
| 4  | São José de Ribamar |
| all | Todas as regiões |

**Atualização automática**
O robô de scraping do G1 Maranhão executa automaticamente a cada hora (\`cron 0 * * * *\`)
e também na inicialização do servidor. Não é necessário chamar \`POST /api/news/external/g1/sync\`
manualmente em produção.

**Autenticação:** Nenhuma — a API é pública.

**CORS:** Aberto para qualquer origem (\`Access-Control-Allow-Origin: *\`).
Qualquer frontend (React, Vue, Angular, Next.js, etc.) pode consumir esta API diretamente.

**Health check:** \`GET /api/health\` — use para verificar conectividade antes de outras requisições.`,
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
  // Caminho absoluto resolvido para compatibilidade com ESM
  apis: [join(__dirname, '../routes/*.js')]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
