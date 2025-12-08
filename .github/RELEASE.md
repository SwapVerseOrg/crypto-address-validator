# Como Fazer Release

Este projeto possui automação completa para releases. Existem duas formas de criar um novo release:

## Opção 1: Via GitHub Actions (Recomendado)

1. Acesse a aba **Actions** no GitHub
2. Selecione o workflow **Release**
3. Clique em **Run workflow**
4. Escolha o tipo de versão:
   - **patch**: Bug fixes (0.0.1 → 0.0.2)
   - **minor**: Novas features (0.0.1 → 0.1.0)
   - **major**: Breaking changes (0.0.1 → 1.0.0)
5. Clique em **Run workflow**

O workflow irá automaticamente:
- ✅ Rodar os testes
- ✅ Fazer build
- ✅ Incrementar a versão no package.json
- ✅ Criar commit e tag
- ✅ Gerar changelog
- ✅ Criar release no GitHub
- ✅ Publicar no npm

## Opção 2: Via Terminal (Local)

```bash
# Para bug fixes (0.0.1 → 0.0.2)
npm run release:patch

# Para novas features (0.0.1 → 0.1.0)
npm run release:minor

# Para breaking changes (0.0.1 → 1.0.0)
npm run release:major
```

**Nota**: Você precisará publicar manualmente no npm:
```bash
npm publish --access public
```

## Configuração Necessária

### Para publicar no npm automaticamente:

1. Crie um token no npm:
   - Acesse https://www.npmjs.com/settings/[seu-usuario]/tokens
   - Clique em **Generate New Token** → **Classic Token**
   - Escolha **Automation**
   - Copie o token

2. Adicione o token nos secrets do GitHub:
   - Vá em **Settings** → **Secrets and variables** → **Actions**
   - Clique em **New repository secret**
   - Nome: `NPM_TOKEN`
   - Valor: Cole o token do npm

### Versionamento Semântico

Seguimos o [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Mudanças incompatíveis na API
- **MINOR** (0.1.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.1): Correções de bugs

## Conventional Commits (Opcional)

Para melhor organização do changelog, use commits no formato:

```
feat: adiciona validação para Cardano
fix: corrige validação de endereços Taproot
docs: atualiza README
chore: atualiza dependências
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `chore`: Manutenção
- `test`: Testes
- `refactor`: Refatoração
