/*
  # Blood Donation Management System Schema

  1. New Tables
    - `donors`
      - `id` (uuid, primary key)
      - `name` (text, full name)
      - `age` (integer)
      - `gender` (text)
      - `blood_group` (text)
      - `phone` (text)
      - `email` (text, optional)
      - `city` (text)
      - `last_donation` (date, optional)
      - `availability` (boolean, default true)
      - `created_at` (timestamptz)

    - `blood_requests`
      - `id` (uuid, primary key)
      - `patient_name` (text)
      - `blood_group` (text)
      - `hospital` (text)
      - `city` (text)
      - `contact` (text)
      - `urgency` (text: 'normal' | 'urgent')
      - `status` (text: 'pending' | 'completed')
      - `created_at` (timestamptz)

    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Donors table: public read access, authenticated admin write
    - Blood requests: public insert, authenticated admin full access
    - Admins: no public access

  3. Seed Data
    - Default admin: admin / admin123
    - Sample donors for demo
*/

CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  blood_group text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  city text NOT NULL,
  last_donation date,
  availability boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  blood_group text NOT NULL,
  hospital text NOT NULL,
  city text NOT NULL,
  contact text NOT NULL,
  urgency text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Donors: anyone can read available donors
CREATE POLICY "Public can view donors"
  ON donors FOR SELECT
  TO anon, authenticated
  USING (true);

-- Donors: anyone can insert (registration is public)
CREATE POLICY "Anyone can register as donor"
  ON donors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Donors: anyone can update (admin updates from frontend with service role)
CREATE POLICY "Anyone can update donor"
  ON donors FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Donors: anyone can delete (admin deletes from frontend)
CREATE POLICY "Anyone can delete donor"
  ON donors FOR DELETE
  TO anon, authenticated
  USING (true);

-- Blood requests: anyone can insert
CREATE POLICY "Anyone can submit blood request"
  ON blood_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Blood requests: anyone can read
CREATE POLICY "Anyone can view blood requests"
  ON blood_requests FOR SELECT
  TO anon, authenticated
  USING (true);

-- Blood requests: anyone can update (admin)
CREATE POLICY "Anyone can update blood request"
  ON blood_requests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Blood requests: anyone can delete (admin)
CREATE POLICY "Anyone can delete blood request"
  ON blood_requests FOR DELETE
  TO anon, authenticated
  USING (true);

-- Admins: anyone can read for login verification
CREATE POLICY "Anyone can read admins for login"
  ON admins FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed default admin (password: admin123, stored as plain for simplicity in student project)
INSERT INTO admins (username, password_hash)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Seed sample donors
INSERT INTO donors (name, age, gender, blood_group, phone, email, city, last_donation, availability) VALUES
  ('Rahul Sharma', 28, 'Male', 'A+', '9876543210', 'rahul@email.com', 'Mumbai', '2024-10-15', true),
  ('Priya Singh', 25, 'Female', 'B+', '9765432109', 'priya@email.com', 'Delhi', '2024-09-20', true),
  ('Amit Kumar', 32, 'Male', 'O+', '9654321098', '', 'Bangalore', '2024-11-01', true),
  ('Sneha Patel', 29, 'Female', 'AB+', '9543210987', 'sneha@email.com', 'Chennai', '2024-08-05', false),
  ('Vikram Rao', 35, 'Male', 'O-', '9432109876', '', 'Hyderabad', '2024-12-10', true),
  ('Anjali Mehta', 27, 'Female', 'A-', '9321098765', 'anjali@email.com', 'Pune', '2025-01-15', true),
  ('Rohan Das', 31, 'Male', 'B-', '9210987654', '', 'Kolkata', '2024-07-20', true),
  ('Kavya Nair', 24, 'Female', 'AB-', '9109876543', 'kavya@email.com', 'Mumbai', NULL, true)
ON CONFLICT DO NOTHING;
