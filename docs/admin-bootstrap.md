# Procedimento de Criação do Primeiro Administrador - Doces da Angel

Por motivos de segurança e conformidade com a política de acesso por privilégio mínimo, **nenhuma senha padrão é definida no código-fonte**.

## Procedimento para Conceder Papel de Administrador

### Opção 1: Via Supabase SQL Editor (Recomendado na Inicialização)

1. Acesse o console do projeto Supabase.
2. Crie a conta do responsável no menu **Authentication > Users** com o email oficial (ex: `arthur@docesdaangel.com.br`).
3. Copie o `User UID` gerado.
4. Execute o comando SQL no **SQL Editor**:

```sql
-- 1. Inserir ou atualizar perfil
INSERT INTO public.profiles (id, name, phone)
VALUES ('<COLE_O_USER_UID_AQUI>', 'Arthur Vieira - Administrador', '(11) 99999-9999')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Conceder papel exclusivo de Administrador
INSERT INTO public.user_roles (user_id, role)
VALUES ('<COLE_O_USER_UID_AQUI>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

5. O usuário agora possui acesso irrestrito às rotas `/admin/*` e funções de gestão.

---

### Opção 2: Via Script de Linha de Comando (CLI / Service Role)

Utilize a função segura do backend executando:

```bash
npm run seed:admin -- --email="arthur@docesdaangel.com.br"
```
