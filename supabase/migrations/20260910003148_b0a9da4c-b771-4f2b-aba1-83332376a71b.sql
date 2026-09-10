-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'company',
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.catalog_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'package',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_products TO authenticated;
GRANT ALL ON public.catalog_products TO service_role;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.catalog_products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.catalog_products
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER catalog_products_updated_at BEFORE UPDATE ON public.catalog_products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE public.catalog_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  includes text[] NOT NULL DEFAULT '{}',
  icon text NOT NULL DEFAULT 'package',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_services TO authenticated;
GRANT ALL ON public.catalog_services TO service_role;
ALTER TABLE public.catalog_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are public" ON public.catalog_services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.catalog_services
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER catalog_services_updated_at BEFORE UPDATE ON public.catalog_services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send an enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner or admin can view enquiries" ON public.enquiries
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
CREATE POLICY "Admins update enquiries" ON public.enquiries
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SEED PRODUCTS
INSERT INTO public.catalog_products (title, category, description, icon, sort_order) VALUES
('Safety Gear & PPE','Safety','Helmets, fire suits, safety jackets, gloves, gum shoes and full site kits.','hard-hat',1),
('Fire Fighting Equipment','Fire','Extinguishers, fire buckets, hose reels, alarm panels and refilling.','flame',2),
('CCTV & Surveillance','Security','IP / HD camera systems, NVR storage, installation and maintenance.','cctv',3),
('Detection Equipment','Security','Walk-through gates, hand-held metal detectors, vehicle inspection mirrors.','scan',4),
('Office Furniture','Furnishing','Workstations, executive tables, chairs, storage and reception setups.','sofa',5),
('Office Stationery','Supply','Complete monthly stationery contracts and consumable items.','clipboard',6),
('Janitorial Supplies & Service','Cleaning','Cleaning chemicals, tissue, dispensers and housekeeping tools.','sparkles',7),
('Electrical & Hardware','Supply','Cables, switchgear, lighting, tools and general hardware items.','package',8),
('Uniforms & Workwear','Furnishing','Corporate uniforms, coveralls, security dress and branded workwear.','users',9);

-- SEED SERVICES
INSERT INTO public.catalog_services (slug, title, description, intro, includes, icon, sort_order) VALUES
('construction','Construction','Civil works, renovation and turnkey site execution with qualified crews.','Turnkey civil works handled end to end — from site clearing and foundations to finishing and handover, executed by supervised in-house crews.',ARRAY['Civil & structural works','Renovation and refurbishment','Site supervision and project management','Fit-out, flooring and finishing','Material procurement for the site'],'building',1),
('safety-security','Safety & Security','Surveys, consultancy, trained security guards and equipment maintenance.','Complete safety and security cover: risk surveys, equipment supply and installation, and trained guards on duty.',ARRAY['Safety surveys and consultancy','Trained security guards','CCTV and access control systems','Fire fighting equipment and refilling','Periodic maintenance and records'],'shield',2),
('event-management','Event Management','Complete organizational capacity to plan and run large-scale events.','Planning, setup and on-ground execution for corporate and large-scale public events of any size.',ARRAY['Venue setup, staging and seating','Sound, lighting and power backup','Event staff, ushers and security','Catering and hospitality arrangement','Branding, panaflex and signage'],'party',3),
('general-order-supply','General Order Supply','Raw and ready material to factories, plus general procurement contracts.','Single-window procurement for raw and ready material, consumables and general order contracts.',ARRAY['Raw and ready material to factories','Office stationery contracts','Electrical and hardware items','Furniture and uniforms','Scheduled monthly deliveries'],'package',4),
('manpower-services','Manpower Services','Skilled workforce, fire fighters, fire tender crews and canteen contracting.','Skilled and unskilled manpower deployed on contract, fully supervised and documented.',ARRAY['Skilled and general labour','Fire fighters and fire tender crews','Canteen contracting and staff','Technical and maintenance staff','Payroll and compliance handling'],'users',5),
('janitorial-services','Janitorial Services','Cleaning staff deployment and daily facility housekeeping.','Daily housekeeping teams with supplies and supervision to keep facilities spotless.',ARRAY['Trained cleaning staff deployment','Daily and deep cleaning schedules','Cleaning chemicals and consumables','Tissue and dispenser refilling','Supervisor reporting'],'sparkles',6),
('rent-a-car','Rent A Car & Bullet Proof Vehicle','Corporate vehicle rental with drivers, plus armoured and bullet proof vehicle solutions for VIP and corporate movement.','Corporate transport on daily, monthly or long-term contracts, including armoured vehicles for sensitive movement.',ARRAY['Cars, vans and coasters with drivers','Bullet proof and armoured vehicles','Airport pick and drop','Monthly corporate contracts','Trained and verified drivers'],'truck',7),
('printing-branding','Printing & Branding','Offset & digital printing, panaflex, annual reports, flyers and cards.','In-house coordinated printing and branding for everything from business cards to full annual reports.',ARRAY['Offset and digital printing','Panaflex, standees and signage','Annual reports and brochures','Flyers, cards and stationery','Design and finishing support'],'printer',8);