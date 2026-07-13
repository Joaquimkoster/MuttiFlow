BEGIN;

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  preco_antigo NUMERIC(10,2) CHECK (preco_antigo IS NULL OR preco_antigo >= 0),
  imagens JSONB NOT NULL DEFAULT '[]'::jsonb,
  ingredientes JSONB NOT NULL DEFAULT '[]'::jsonb,
  peso VARCHAR(50),
  porcao VARCHAR(50),
  badge VARCHAR(50),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sku VARCHAR(100),
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  ordenacao INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrinhos (
  id SERIAL PRIMARY KEY,
  sessao_id VARCHAR(255) UNIQUE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrinho_itens (
  id SERIAL PRIMARY KEY,
  carrinho_id INTEGER NOT NULL REFERENCES carrinhos(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (carrinho_id, produto_id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  sessao_id VARCHAR(255) NOT NULL,
  cliente_nome VARCHAR(150) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  forma_pagamento VARCHAR(80) NOT NULL DEFAULT 'Pix',
  pagamento_status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
  endereco TEXT NOT NULL,
  complemento TEXT,
  cidade VARCHAR(100),
  bairro VARCHAR(100),
  data_entrega DATE NOT NULL,
  horario VARCHAR(50) NOT NULL,
  observacoes TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  frete NUMERIC(10,2) NOT NULL DEFAULT 7,
  desconto NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Agendado',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS pagamento_status VARCHAR(20) NOT NULL DEFAULT 'Pendente';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE pedidos ALTER COLUMN forma_pagamento SET DEFAULT 'Pix';
UPDATE pedidos SET forma_pagamento = 'Pix' WHERE forma_pagamento <> 'Pix';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pedidos_forma_pagamento_pix'
  ) THEN
    ALTER TABLE pedidos
      ADD CONSTRAINT pedidos_forma_pagamento_pix CHECK (forma_pagamento = 'Pix');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  produto_nome VARCHAR(255) NOT NULL,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0)
);

CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(150) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  endereco TEXT NOT NULL,
  convidados INTEGER NOT NULL CHECK (convidados > 0),
  valor NUMERIC(12,2) CHECK (valor IS NULL OR valor >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'Aguardando',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON pedidos (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_data_entrega ON pedidos (data_entrega);
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos (data);

UPDATE eventos SET status = 'Aceito' WHERE status IN ('Agendado', 'Confirmado');

INSERT INTO categorias (nome, slug) VALUES
  ('Massas', 'massas'),
  ('Combos', 'combos'),
  ('Sobremesas', 'sobremesas'),
  ('Bebidas', 'bebidas')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (nome, slug, categoria_id, descricao, preco, preco_antigo, imagens, ingredientes, peso, porcao, badge, featured, estoque, ordenacao)
VALUES
  ('Lasanha Família Mutti', 'lasanha-familia', (SELECT id FROM categorias WHERE slug = 'massas'), 'Lasanha artesanal com molho de tomate lento, bechamel cremoso, queijo gratinado e massa fresca.', 89.90, 104.90, '["https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1000&q=80"]', '["Massa fresca","Molho pomodoro","Carne selecionada","Muçarela","Parmesão"]', '1,4 kg', 'Serve 4 pessoas', 'Mais vendido', TRUE, 100, 1),
  ('Combo Domingo Italiano', 'combo-domingo', (SELECT id FROM categorias WHERE slug = 'combos'), 'Seleção completa com massa, antepasto, sobremesa e bebida para uma refeição especial.', 149.90, NULL, '["https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80"]', '["Ravioli","Focaccia","Tiramisù","Suco artesanal"]', '2,2 kg', 'Serve 5 pessoas', 'Combo', TRUE, 100, 2),
  ('Ravioli Caprese', 'ravioli-caprese', (SELECT id FROM categorias WHERE slug = 'massas'), 'Ravioli recheado com queijo, tomate confit e manjericão fresco finalizado com azeite.', 64.90, NULL, '["https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80"]', '["Ravioli fresco","Tomate confit","Manjericão","Azeite","Queijo"]', '650 g', 'Serve 2 pessoas', 'Novo', TRUE, 100, 3),
  ('Tiramisù Clássico', 'tiramisu', (SELECT id FROM categorias WHERE slug = 'sobremesas'), 'Sobremesa italiana com mascarpone, café espresso, cacau e biscoito champagne.', 32.90, NULL, '["https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80"]', '["Mascarpone","Café","Cacau","Biscoito champagne"]', '220 g', 'Serve 1 pessoa', 'Premium', FALSE, 100, 4),
  ('Focaccia da Casa', 'focaccia', (SELECT id FROM categorias WHERE slug = 'massas'), 'Focaccia de fermentação lenta com alecrim, flor de sal e azeite extra virgem.', 28.90, NULL, '["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=80"]', '["Farinha italiana","Azeite","Alecrim","Flor de sal"]', '420 g', 'Serve 3 pessoas', 'Artesanal', FALSE, 100, 5),
  ('Limonada Siciliana', 'limonada', (SELECT id FROM categorias WHERE slug = 'bebidas'), 'Limonada natural com limão siciliano, hortelã e leve toque de mel.', 16.90, NULL, '["https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1000&q=80"]', '["Limão siciliano","Hortelã","Mel","Água com gás"]', '500 ml', 'Serve 1 pessoa', 'Natural', FALSE, 100, 6)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
