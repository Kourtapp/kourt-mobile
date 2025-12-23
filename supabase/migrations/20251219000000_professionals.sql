-- Criar tabela de profissionais
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  qualifications TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tipo ENUM para categorias de serviço
DO $$ BEGIN
  CREATE TYPE service_category AS ENUM (
    'personal_trainer',
    'sports_coach',
    'nutritionist',
    'physiotherapist',
    'masseuse'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de serviços profissionais
CREATE TABLE IF NOT EXISTS professional_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  category service_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_services_professional_id ON professional_services(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_services_category ON professional_services(category);

-- Row Level Security (RLS)
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para professionals
DROP POLICY IF EXISTS "Usuários podem ver profissionais ativos" ON professionals;
CREATE POLICY "Usuários podem ver profissionais ativos"
  ON professionals FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar seu próprio perfil profissional" ON professionals;
CREATE POLICY "Usuários podem criar seu próprio perfil profissional"
  ON professionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON professionals;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON professionals FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para professional_services
DROP POLICY IF EXISTS "Todos podem ver serviços ativos" ON professional_services;
CREATE POLICY "Todos podem ver serviços ativos"
  ON professional_services FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM professionals
    WHERE id = professional_id
    AND user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Profissionais podem criar seus serviços" ON professional_services;
CREATE POLICY "Profissionais podem criar seus serviços"
  ON professional_services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE id = professional_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Profissionais podem atualizar seus serviços" ON professional_services;
CREATE POLICY "Profissionais podem atualizar seus serviços"
  ON professional_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE id = professional_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Profissionais podem deletar seus serviços" ON professional_services;
CREATE POLICY "Profissionais podem deletar seus serviços"
  ON professional_services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM professionals
      WHERE id = professional_id
      AND user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_professionals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_professionals_updated_at ON professionals;
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_professionals_updated_at();
