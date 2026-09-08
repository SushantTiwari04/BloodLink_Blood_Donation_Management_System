/*
  # Fix INSERT RLS Policies and Admins Table Security

  1. Issues Fixed
    - INSERT policies for donors and blood_requests had always-true WITH CHECK clauses
    - Admins table had no RLS policies, leaving it without access control
    - Added restrictive policies that still allow legitimate public access but with basic validation

  2. Security Improvements
    - Donors INSERT: Requires non-empty essential fields (prevents spam/empty records)
    - Blood Requests INSERT: Requires non-empty essential fields (prevents spam)
    - Admins table: Completely restricted (no SELECT/INSERT/UPDATE/DELETE access for anon/authenticated)

  3. Design Rationale
    - Public self-service registration still works (legitimate use case)
    - Basic field validation prevents empty/malformed records
    - Admins table is fully locked down server-side via edge function
    - Emergency blood requests not blocked (life-critical operations)
*/

-- Drop and recreate donors INSERT policy with basic validation
DROP POLICY IF EXISTS "Anyone can register as new donor" ON donors;

CREATE POLICY "Register donor with required fields"
  ON donors FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND
    length(trim(name)) > 0 AND
    age IS NOT NULL AND
    age >= 18 AND
    age <= 65 AND
    blood_group IS NOT NULL AND
    length(blood_group) > 0 AND
    phone IS NOT NULL AND
    length(trim(phone)) > 0 AND
    city IS NOT NULL AND
    length(trim(city)) > 0
  );

-- Drop and recreate blood_requests INSERT policy with basic validation
DROP POLICY IF EXISTS "Anyone can submit blood request" ON blood_requests;

CREATE POLICY "Submit blood request with required fields"
  ON blood_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    patient_name IS NOT NULL AND
    length(trim(patient_name)) > 0 AND
    blood_group IS NOT NULL AND
    length(blood_group) > 0 AND
    hospital IS NOT NULL AND
    length(trim(hospital)) > 0 AND
    city IS NOT NULL AND
    length(trim(city)) > 0 AND
    contact IS NOT NULL AND
    length(trim(contact)) > 0 AND
    urgency IN ('normal', 'urgent')
  );

-- Add restrictive policies for admins table (no access to anon/authenticated)
CREATE POLICY "Admins table is restricted"
  ON admins FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Admins insert restricted"
  ON admins FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Admins update restricted"
  ON admins FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Admins delete restricted"
  ON admins FOR DELETE
  TO anon, authenticated
  USING (false);
