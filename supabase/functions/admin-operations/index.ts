import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface VerifyAdminRequest {
  username: string;
  password: string;
}

interface UpdateDonorRequest {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  phone: string;
  email: string;
  city: string;
  last_donation: string | null;
  availability: boolean;
}

interface DeleteDonorRequest {
  id: string;
}

interface UpdateRequestStatusRequest {
  id: string;
  status: 'pending' | 'completed';
}

interface DeleteBloodRequestRequest {
  id: string;
}

async function verifyAdmin(req: VerifyAdminRequest): Promise<{ valid: boolean }> {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('username', req.username)
    .eq('password_hash', req.password)
    .maybeSingle();

  return { valid: !error && !!data };
}

async function updateDonor(req: UpdateDonorRequest): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('donors')
    .update({
      name: req.name,
      age: req.age,
      gender: req.gender,
      blood_group: req.blood_group,
      phone: req.phone,
      email: req.email,
      city: req.city,
      last_donation: req.last_donation,
      availability: req.availability,
    })
    .eq('id', req.id);

  return { success: !error };
}

async function deleteDonor(req: DeleteDonorRequest): Promise<{ success: boolean }> {
  const { error } = await supabase.from('donors').delete().eq('id', req.id);
  return { success: !error };
}

async function updateRequestStatus(
  req: UpdateRequestStatusRequest
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('blood_requests')
    .update({ status: req.status })
    .eq('id', req.id);

  return { success: !error };
}

async function deleteBloodRequest(
  req: DeleteBloodRequestRequest
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('blood_requests')
    .delete()
    .eq('id', req.id);

  return { success: !error };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();

    let result;

    switch (action) {
      case 'verify-admin':
        result = await verifyAdmin(payload as VerifyAdminRequest);
        break;
      case 'update-donor':
        result = await updateDonor(payload as UpdateDonorRequest);
        break;
      case 'delete-donor':
        result = await deleteDonor(payload as DeleteDonorRequest);
        break;
      case 'update-request-status':
        result = await updateRequestStatus(payload as UpdateRequestStatusRequest);
        break;
      case 'delete-blood-request':
        result = await deleteBloodRequest(payload as DeleteBloodRequestRequest);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
