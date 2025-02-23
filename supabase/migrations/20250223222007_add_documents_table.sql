/*
  # Documents Management System Schema

  1. New Tables
    - documents: Core document information and metadata
    
  2. Security
    - Enable RLS on documents table
    - Add policies for data access control
    - Implement proper owner and sharing controls

  3. Document Types
    - project_pl (mandatory)
    - project_claims
    - project_proposals
    - briefing_decks
*/

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  folder TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  document_type TEXT CHECK (document_type IN ('project_pl', 'project_claim', 'project_proposal', 'briefing_deck')),
  project_id UUID,
  shared_with UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own documents"
ON documents FOR SELECT
TO authenticated
USING (
  auth.uid() = owner_id OR
  auth.uid() = ANY(shared_with)
);

CREATE POLICY "Users can insert their own documents"
ON documents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own documents"
ON documents FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own documents"
ON documents FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(document_type);
