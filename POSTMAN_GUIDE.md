# 🚀 Coleção Postman - Stock Management API

Este arquivo contém uma coleção completa do Postman para testar todos os endpoints da API de gerenciamento de estoque.

## 📥 Como Importar

### 1. **Abrir o Postman**

- Abra o aplicativo Postman
- Clique em **"Import"** no canto superior esquerdo

### 2. **Importar o Arquivo**

- Selecione **"Upload Files"**
- Escolha o arquivo `postman-collection.json`
- Clique em **"Import"**

### 3. **Configurar Variáveis**

A coleção já vem com variáveis pré-configuradas:

- `{{baseUrl}}` = `http://localhost:3000`
- `{{productId}}` = Será preenchido automaticamente

## 🎯 Endpoints Incluídos

### **📊 Operações Básicas**

- ✅ **Health Check** - Verificar se a API está funcionando
- ✅ **Get All Stock** - Listar produtos com paginação
- ✅ **Get Stock by ID** - Buscar produto específico
- ✅ **Create Product** - Criar novo produto
- ✅ **Update Stock** - Atualizar quantidade em estoque
- ✅ **Delete Product** - Remover produto

### **📝 Exemplos de Dados**

- **Produto Teste** - Dados básicos para teste
- **iPhone 15 Pro** - Exemplo de smartphone
- **MacBook Pro M3** - Exemplo de notebook
- **AirPods Pro** - Exemplo de fones de ouvido

### **⚠️ Testes de Erro**

- **Produto não encontrado** - Testa tratamento de erro
- **Campos obrigatórios** - Testa validação de entrada
- **IDs inválidos** - Testa robustez da API

## 🔧 Funcionalidades Automáticas

### **📋 Scripts de Teste**

A coleção inclui scripts automáticos que:

- ✅ **Salvam o ID** do produto criado automaticamente
- ✅ **Testam status codes** de sucesso
- ✅ **Verificam tempo de resposta** (< 5 segundos)
- ✅ **Logam informações** no console

### **🔄 Fluxo de Teste Recomendado**

1. **Iniciar o servidor**:

   ```bash
   npm run start:dev
   ```

2. **Testar Health Check**:
   - Execute `Health Check`
   - Deve retornar status 200

3. **Criar produtos**:
   - Execute `Create Product - Smartphone`
   - Execute `Create Product - Notebook`
   - Execute `Create Product - Headphones`

4. **Listar produtos**:
   - Execute `Get All Stock`
   - Verifique a paginação

5. **Buscar produto específico**:
   - Execute `Get Stock by ID`
   - O ID será preenchido automaticamente

6. **Atualizar estoque**:
   - Execute `Update Stock - Increase`
   - Execute `Update Stock - Decrease`

7. **Testar erros**:
   - Execute `Test Error - Get Non-existent Product`
   - Execute `Test Validation - Create Product Missing Fields`

8. **Deletar produto**:
   - Execute `Delete Product`

## 📊 Estrutura dos Dados

### **📦 Modelo de Produto**

```json
{
  "name": "Nome do Produto",
  "quantity": 100,
  "relationalId": 12345
}
```

### **📋 Campos Obrigatórios**

- `name` (string) - Nome do produto
- `quantity` (number) - Quantidade em estoque
- `relationalId` (number) - ID relacional único

### **🔄 Respostas da API**

#### **✅ Sucesso (200/201)**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "quantity": 50,
  "relationalId": 1001
}
```

#### **❌ Erro (404)**

```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

## 🛠️ Personalização

### **🔧 Alterar URL Base**

1. Clique na coleção no Postman
2. Vá para a aba **"Variables"**
3. Altere o valor de `baseUrl` para sua URL

### **📝 Adicionar Novos Testes**

1. Clique com botão direito na coleção
2. Selecione **"Add Request"**
3. Configure o endpoint desejado

### **🧪 Adicionar Validações**

1. Vá para a aba **"Tests"** de qualquer requisição
2. Adicione scripts de validação personalizados

## 🚀 Próximos Passos

Após testar todos os endpoints:

1. **Implementar autenticação** (JWT)
2. **Adicionar validações** mais robustas
3. **Configurar Swagger** para documentação
4. **Implementar testes unitários**
5. **Adicionar logs** estruturados

## 📚 Recursos Úteis

- **Postman Learning Center**: https://learning.postman.com/
- **NestJS Documentation**: https://docs.nestjs.com/
- **MongoDB Documentation**: https://docs.mongodb.com/

---

**🎉 Divirta-se testando sua API!**

A coleção está pronta para uso e inclui todos os cenários de teste necessários para validar o funcionamento completo do sistema de estoque.
