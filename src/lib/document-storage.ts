import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Document = Database['public']['Tables']['documents']['Row'];

export async function uploadDocument(file: File, metadata: Partial<Document>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Upload file to Supabase Storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(`${user.id}/${file.name}`, file);

  if (uploadError) throw uploadError;

  // Create document record
  const { data: document, error: dbError } = await supabase
    .from('documents')
    .insert({
      name: file.name,
      type: file.type,
      size: file.size,
      folder: metadata.folder || 'General',
      storage_path: fileData.path,
      owner_id: user.id,
      document_type: metadata.document_type,
      project_id: metadata.project_id,
      shared_with: metadata.shared_with || []
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup uploaded file if database insert fails
    await supabase.storage
      .from('documents')
      .remove([fileData.path]);
    throw dbError;
  }

  return document;
}

export async function downloadDocument(document: Document) {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(document.storage_path);

  if (error) throw error;
  return data;
}

export async function deleteDocument(document: Document) {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([document.storage_path]);

  if (storageError) throw storageError;

  // Delete document record
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', document.id);

  if (dbError) throw dbError;
}

export async function shareDocument(document: Document, userIds: string[]) {
  const { error } = await supabase
    .from('documents')
    .update({
      shared_with: [...new Set([...(document.shared_with || []), ...userIds])]
    })
    .eq('id', document.id);

  if (error) throw error;
}

export async function unshareDocument(document: Document, userId: string) {
  const { error } = await supabase
    .from('documents')
    .update({
      shared_with: (document.shared_with || []).filter(id => id !== userId)
    })
    .eq('id', document.id);

  if (error) throw error;
}
