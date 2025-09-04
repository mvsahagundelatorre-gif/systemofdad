-- Location: supabase/migrations/20250904052503_admin_system_setup.sql
-- Schema Analysis: No existing schema found
-- Integration Type: Complete setup with admin-based authentication system
-- Dependencies: Fresh database setup

-- 1. TYPES AND ENUMS
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.request_type AS ENUM ('password_change', 'account_modification');
CREATE TYPE public.report_status AS ENUM ('draft', 'submitted', 'reviewed', 'approved', 'rejected');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- 2. CORE TABLES

-- User Profiles (Critical intermediary table for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    role public.user_role NOT NULL DEFAULT 'employee'::public.user_role,
    department TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Password Change Requests
CREATE TABLE public.password_change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    current_password_hash TEXT NOT NULL,
    new_password_hash TEXT NOT NULL,
    reason TEXT,
    request_status public.request_status DEFAULT 'pending'::public.request_status,
    requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT
);

-- Reports/Documents Table
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    report_type TEXT NOT NULL,
    priority public.priority_level DEFAULT 'medium'::public.priority_level,
    status public.report_status DEFAULT 'draft'::public.report_status,
    created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Admin Notifications (for email alerts)
CREATE TABLE public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_entity_type TEXT, -- 'password_change_request', 'report', etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log for admin actions
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);
CREATE INDEX idx_password_requests_user_id ON public.password_change_requests(user_id);
CREATE INDEX idx_password_requests_status ON public.password_change_requests(request_status);
CREATE INDEX idx_reports_created_by ON public.reports(created_by);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_priority ON public.reports(priority);
CREATE INDEX idx_notifications_recipient ON public.admin_notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON public.admin_notifications(is_read);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 4. FUNCTIONS (MUST BE BEFORE RLS POLICIES)

-- Function to check if user is admin (uses auth.users metadata - safe pattern)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Alternative admin check using user_profiles (for non-user tables)
CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'employee'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to notify admins of password change requests
CREATE OR REPLACE FUNCTION public.notify_admins_password_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_record RECORD;
    requester_name TEXT;
BEGIN
    -- Get requester name
    SELECT full_name INTO requester_name
    FROM public.user_profiles
    WHERE id = NEW.user_id;

    -- Insert notifications for all admins
    FOR admin_record IN 
        SELECT id FROM public.user_profiles WHERE role = 'admin' AND is_active = true
    LOOP
        INSERT INTO public.admin_notifications (
            recipient_id,
            notification_type,
            title,
            message,
            related_entity_type,
            related_entity_id
        ) VALUES (
            admin_record.id,
            'password_change_request',
            'Nueva Solicitud de Cambio de Contraseña',
            requester_name || ' ha solicitado cambiar su contraseña. Revise la solicitud para aprobar o rechazar.',
            'password_change_request',
            NEW.id
        );
    END LOOP;

    RETURN NEW;
END;
$$;

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Pattern 1: Core user table - Simple policies only
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin can manage all profiles
CREATE POLICY "admins_manage_all_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Pattern 2: Simple user ownership for password change requests
CREATE POLICY "users_manage_own_password_requests"
ON public.password_change_requests
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can view and manage all password requests
CREATE POLICY "admins_manage_password_requests"
ON public.password_change_requests
FOR ALL
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Pattern 2: Simple user ownership for reports
CREATE POLICY "users_manage_own_reports"
ON public.reports
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Admins can manage all reports
CREATE POLICY "admins_manage_all_reports"
ON public.reports
FOR ALL
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Admin notifications - only recipients can view their own
CREATE POLICY "users_view_own_notifications"
ON public.admin_notifications
FOR SELECT
TO authenticated
USING (recipient_id = auth.uid());

-- Only admins can create notifications
CREATE POLICY "admins_create_notifications"
ON public.admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_admin_role());

-- Audit logs - only admins can view
CREATE POLICY "admins_view_audit_logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_admin_role());

-- 7. TRIGGERS

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for password change request notifications
CREATE TRIGGER notify_admins_on_password_request
    AFTER INSERT ON public.password_change_requests
    FOR EACH ROW EXECUTE FUNCTION public.notify_admins_password_request();

-- 8. INITIAL ADMIN USER (NO MOCK DATA - CLEAN SYSTEM)
-- Create only essential admin user with zero records initially
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth user for admin
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@sistema.com', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Administrador del Sistema", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Log admin creation
    RAISE NOTICE 'Sistema inicializado con administrador: admin@sistema.com / Admin123!';
    RAISE NOTICE 'IMPORTANTE: Cambie la contraseña del administrador después del primer inicio de sesión';
END $$;

-- 9. CLEANUP FUNCTION FOR DEVELOPMENT
CREATE OR REPLACE FUNCTION public.reset_system_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Reset all counters to 0 as requested
    DELETE FROM public.audit_logs;
    DELETE FROM public.admin_notifications;
    DELETE FROM public.password_change_requests;
    DELETE FROM public.reports;
    
    -- Keep only admin users, remove all other profiles
    DELETE FROM public.user_profiles 
    WHERE role != 'admin';
    
    -- Reset sequences/counters (if any)
    -- All records start from 0 except essential admin
    
    RAISE NOTICE 'Sistema reiniciado: todos los registros en 0, solo administrador activo';
END;
$$;

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Perfiles de usuario con roles administrativos';
COMMENT ON TABLE public.password_change_requests IS 'Solicitudes de cambio de contraseña que requieren aprobación administrativa';
COMMENT ON TABLE public.reports IS 'Reportes y documentos del sistema';
COMMENT ON TABLE public.admin_notifications IS 'Notificaciones para administradores';
COMMENT ON TABLE public.audit_logs IS 'Registro de auditoría de acciones administrativas';