# 🦷 Centro Odonto — Sistema Odontológico Clínico

Sistema de gestão e prontuário clínico odontológico moderno, com foco em usabilidade para o cirurgião-dentista, suporte completo à notação dentária **FDI (11 a 48)**, esteira de atendimentos e tabela própria de procedimentos com controle de honorários.

---

## 🎨 Identidade Visual & Design System
- **Paleta de Cores**: Branco Clínico (`#FAF8F5`, `#FFFFFF`), Marrom Nobre Acolhedor (`#8B623B`, `#52361D`, `#DCBF9E`) e detalhes em Esmeralda Suave para faturamento.
- **Tipografia**: Outfit & Inter com hierarquia limpa e alto contraste.
- **Experiência do Dentista**: Redução de fricção operacional no consultório, com seleção ágil de dentes e apontamento clínico em poucos cliques.

---

## ✨ Funcionalidades Principais

1. **Cockpit Clínico do Paciente**:
   - Apresentação em lista contendo **apenas os dentes com apontamento ativo** (dentes hígidos não poluem a visão clínica).
   - Seletor de dentes (11 a 48, sem finais 9) exibido sob demanda ao lançar um estado.
   - Diagnósticos rápidos (*Cariado*, *Restaurado*, *Canal Tratado*, *Implante*, *Coroa*, *Fratura/Trinca*, *Faceta/Lente*, *Mobilidade*, *Ausente*, *Extraído*) ou criação de estados personalizados.
   - Seleção de faces acometidas (*V, M, O, D, L*).
   - Vinculação de procedimentos da tabela da clínica com cálculo automático de honorários em R$.

2. **Evoluções Clínicas & Assinatura Digital**:
   - Registro de histórico e evolução do atendimento.
   - Selo de integridade e assinatura digital criptográfica (SHA-256).

3. **Esteira de Atendimento (Kanban Recepção & Consultório)**:
   - 5 etapas de fluxo operacional: *Agendado &rarr; Confirmado &rarr; Na Sala de Espera &rarr; Em Atendimento &rarr; Concluído*.

4. **Tabela Própria de Procedimentos (Sem complexidade TUSS/AMB)**:
   - Catálogo interno da clínica com preços em R$, categorias e criação facilitada de novos procedimentos.

5. **Manejo de Pacientes**:
   - Cadastro e busca por nome ou CPF.
   - Abertura imediata do prontuário na cadeira odontológica.

6. **Conclusão de Consulta & Faturamento**:
   - Resumo dos procedimentos realizados na sessão.
   - Escolha do meio de pagamento (Pix, Cartão de Crédito/Débito, Dinheiro).
   - Geração de recibo e orientações pós-atendimento.

---

## 🏗️ Arquitetura & Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Lucide Icons.
- **Backend**: Node.js, Fastify/Express, TypeScript, Domain-Driven Design (DDD), Clean Architecture.
- **Banco de Dados & ORM**: PostgreSQL 16 + Prisma ORM.
- **Infraestrutura**: Docker & Docker Compose (PostgreSQL, Redis, MinIO, Frontend e Backend).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados.

### Executando com Docker Compose:
```bash
# 1. Clonar o repositório
git clone https://github.com/luispedrodelima4-art/centro-odonto.git
cd centro-odonto

# 2. Copiar as variáveis de ambiente
cp .env.example .env

# 3. Subir todos os serviços (PostgreSQL, Redis, MinIO, Backend e Frontend)
docker compose up -d
```

### Acessos:
- **Frontend Clínico**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3333/api/v1](http://localhost:3333/api/v1)
- **Documentação Swagger**: [http://localhost:3333/docs](http://localhost:3333/docs)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001)

### Credenciais Padrão (Ambiente de Demonstração):
- **Dentista Responsável**: `carlos.eduardo@centroodonto.com` / `Password123!` (CRO-SP 123456)
- **Acesso Rápido**: Botão *"Entrar como Dr. Carlos Eduardo"* disponível na tela inicial.

---

## 📄 Licença
Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
