export function validatePropertyPayload(data: any, hasUploadedFiles = false) {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string.');
  }
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required and must be a string.');
  }
  if (!data.category || !['HOUSES', 'VILLAS', 'TERRAIN'].includes(data.category)) {
    errors.push('Category must be HOUSES, VILLAS, or TERRAIN.');
  }
  if (!data.transactionType || !['SALE', 'RENT'].includes(data.transactionType)) {
    errors.push('Transaction type must be SALE or RENT.');
  }
  // Price is optional — defaults to 0 if not provided.

  // Images are optional — a placeholder is shown on the frontend if none provided.

  return errors;
}

export function validateContactLead(data: any) {
  const errors: string[] = [];
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string.');
  }
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string.');
  }
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone is required and must be a string.');
  }
  if (!data.propertyId || typeof data.propertyId !== 'string') {
    errors.push('Property ID is required and must be a string.');
  }
  return errors;
}
