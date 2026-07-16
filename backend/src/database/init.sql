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
  telefone VARCHAR(30) NOT NULL,
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

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS telefone VARCHAR(30);

CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON pedidos (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_data_entrega ON pedidos (data_entrega);
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos (data);

UPDATE eventos SET status = 'Aceito' WHERE status IN ('Agendado', 'Confirmado');

INSERT INTO categorias (nome, slug) VALUES
  ('Terça', 'terca'),
  ('Quarta', 'quarta'),
  ('Quinta', 'quinta'),
  ('Sexta', 'sexta')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id, nome, slug, categoria_id, descricao, preco, preco_antigo, imagens, ingredientes, peso, porcao, badge, featured, estoque, ordenacao, status)
VALUES
  (1, 'Multigrãos', 'multigraos', (SELECT id FROM categorias WHERE slug = 'terca'), 'Blend de farinhas com sementes especiais: girassol, abóbora, chia, linhaça, gergelim e avelã.', 26.00, NULL, '["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85"]', '["Farinha artesanal","Girassol","Abóbora","Chia","Linhaça","Gergelim","Avelã"]', 'Produção artesanal', '1 unidade', 'Nutritivo', TRUE, 100, 1, 'ativo'),
  (2, 'Pão Caseirinho', 'pao-caseirinho', (SELECT id FROM categorias WHERE slug = 'terca'), 'Feito com levain e trigo especial. Aromático, macio e com gostinho de casa.', 22.00, NULL, '["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Levain","Água","Sal"]', 'Produção artesanal', '1 unidade', 'Queridinho', TRUE, 100, 2, 'ativo'),
  (3, 'Kit Pão de Batata', 'kit-pao-batata', (SELECT id FROM categorias WHERE slug = 'terca'), 'Kit com 4 pãezinhos de batata, com 50 g cada.', 9.00, NULL, '["https://images.unsplash.com/photo-1757332914512-ffaf5b521ba8?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Batata","Fermento","Sal"]', '4 × 50 g', 'Kit com 4 unidades', 'Terça', FALSE, 100, 3, 'ativo'),
  (4, 'Kit Cenourinha', 'kit-cenourinha', (SELECT id FROM categorias WHERE slug = 'terca'), 'Oito pãezinhos nutritivos feitos com levain e cúrcuma.', 18.00, NULL, '["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Cenoura","Levain","Cúrcuma"]', '8 × 30 g', 'Kit com 8 unidades', 'Terça', FALSE, 100, 4, 'ativo'),
  (5, 'Pão de Forma', 'pao-forma', (SELECT id FROM categorias WHERE slug = 'terca'), 'Feito com levain e trigo especial, com miolo leve e macio.', 22.00, NULL, '["https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Levain","Água","Sal"]', 'Produção artesanal', '1 unidade', 'Terça', FALSE, 100, 5, 'ativo'),
  (6, 'Pão Italiano', 'pao-italiano', (SELECT id FROM categorias WHERE slug = 'quarta'), 'Pão rústico de fermentação lenta, casca dourada e aroma especial.', 27.00, NULL, '["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Levain","Água","Sal"]', 'Produção artesanal', '1 unidade', 'Fermentação lenta', TRUE, 100, 6, 'ativo'),
  (7, 'Alecrim e Azeitonas', 'alecrim-azeitonas', (SELECT id FROM categorias WHERE slug = 'quarta'), 'Pão de longa fermentação, aromatizado com alecrim fresco e azeitonas.', 28.00, NULL, '["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Levain","Alecrim fresco","Azeitonas"]', 'Produção artesanal', '1 unidade', 'Quarta', FALSE, 100, 7, 'ativo'),
  (8, 'Pão Multigrãos', 'pao-multigraos', (SELECT id FROM categorias WHERE slug = 'quarta'), 'Pão rústico e nutritivo com uma seleção de grãos incorporados à massa.', 30.00, NULL, '["https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=85"]', '["Farinha artesanal","Levain","Sementes","Grãos"]', 'Produção artesanal', '1 unidade', 'Rústico', FALSE, 100, 8, 'ativo'),
  (9, 'Crosta de Aveia', 'crosta-aveia', (SELECT id FROM categorias WHERE slug = 'quarta'), 'Pão de levain muito aromático, finalizado com uma delicada crosta de aveia.', 27.00, NULL, '["https://images.unsplash.com/photo-1568471173242-461f0a730452?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Levain","Aveia","Sal"]', 'Produção artesanal', '1 unidade', 'Quarta', FALSE, 100, 9, 'ativo'),
  (10, 'Pão Australiano', 'pao-australiano', (SELECT id FROM categorias WHERE slug = 'quarta'), 'Pão macio e úmido, feito com cacau e melaço, de aroma marcante.', 28.00, NULL, '["https://images.unsplash.com/photo-1559811814-e2c57b5e69df?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Cacau","Melaço","Fermento natural"]', 'Produção artesanal', '1 unidade', 'Quarta', FALSE, 100, 10, 'ativo'),
  (11, 'Pão Colonial', 'pao-colonial', (SELECT id FROM categorias WHERE slug = 'quinta'), 'Massa macia com toque de fubá, casca dourada e sabor caseiro.', 24.00, NULL, '["https://images.unsplash.com/photo-1541833000669-75e92444e2a3?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Fubá","Levain","Sal"]', 'Produção artesanal', '1 unidade', 'Quinta', FALSE, 100, 11, 'ativo'),
  (12, 'Bolo de Cenoura', 'bolo-cenoura', (SELECT id FROM categorias WHERE slug = 'quinta'), 'Feito com cenouras frescas e cobertura tradicional de chocolate 100% cacau.', 18.00, NULL, '["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=85"]', '["Cenoura fresca","Farinha","Ovos","Chocolate 100% cacau"]', 'Produção artesanal', '1 unidade', 'Afetivo', FALSE, 100, 12, 'ativo'),
  (13, 'Bolo de Chocolate', 'bolo-chocolate', (SELECT id FROM categorias WHERE slug = 'quinta'), 'Bolo macio feito com cacau 100% e uma leve cobertura de ganache.', 18.00, NULL, '["https://images.unsplash.com/photo-1540337706094-da10342c93d8?auto=format&fit=crop&w=1000&q=85"]', '["Cacau 100%","Farinha","Ovos","Ganache"]', 'Produção artesanal', '1 unidade', 'Quinta', FALSE, 100, 13, 'ativo'),
  (14, 'Cinnamon Rolls', 'cinnamon-rolls', (SELECT id FROM categorias WHERE slug = 'quinta'), 'Dois pãezinhos suecos em espiral, recheados com canela e finalizados com cream cheese.', 20.00, NULL, '["https://images.unsplash.com/photo-1559745757-f6219279c3e5?auto=format&fit=crop&w=1000&q=85"]', '["Canela","Manteiga","Açúcar","Cream cheese","Baunilha"]', 'Produção artesanal', 'Kit com 2 unidades', 'Kit com 2', TRUE, 100, 14, 'ativo'),
  (15, 'Pizza Pomodoro', 'pizza-pomodoro', (SELECT id FROM categorias WHERE slug = 'sexta'), 'Pizza de longa fermentação, entre 24 e 72 horas, leve, saborosa e fácil de digerir.', 15.00, NULL, '["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=85"]', '["Farinha italiana","Molho pomodoro","Fermento natural","Azeite"]', 'Produção artesanal', '1 unidade', '24–72h', TRUE, 100, 15, 'ativo'),
  (16, 'Focaccia Tradicional', 'focaccia-tradicional', (SELECT id FROM categorias WHERE slug = 'sexta'), 'Pão italiano rústico, de fermentação lenta, crocante por fora e úmido por dentro.', 28.00, NULL, '["https://images.unsplash.com/photo-1593280405106-e438ebe93f5b?auto=format&fit=crop&w=1000&q=85"]', '["Farinha italiana","Azeite","Fermento natural","Sal"]', 'Produção artesanal', '1 unidade', 'Sexta', FALSE, 100, 16, 'ativo'),
  (17, 'Tortano Napoletano', 'tortano-napoletano', (SELECT id FROM categorias WHERE slug = 'sexta'), 'Pão típico de Nápoles enriquecido com calabresa, azeite e funcho.', 30.00, NULL, '["https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=85"]', '["Farinha de trigo","Calabresa","Azeite","Funcho"]', 'Produção artesanal', '1 unidade', 'Nápoles', FALSE, 100, 17, 'ativo')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  slug = EXCLUDED.slug,
  categoria_id = EXCLUDED.categoria_id,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  preco_antigo = EXCLUDED.preco_antigo,
  imagens = EXCLUDED.imagens,
  ingredientes = EXCLUDED.ingredientes,
  peso = EXCLUDED.peso,
  porcao = EXCLUDED.porcao,
  badge = EXCLUDED.badge,
  featured = EXCLUDED.featured,
  estoque = EXCLUDED.estoque,
  ordenacao = EXCLUDED.ordenacao,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

SELECT setval(pg_get_serial_sequence('produtos', 'id'), (SELECT MAX(id) FROM produtos));

UPDATE carrinho_itens ci
SET preco_unitario = p.preco,
    atualizado_em = CURRENT_TIMESTAMP
FROM produtos p
WHERE p.id = ci.produto_id;

COMMIT;
