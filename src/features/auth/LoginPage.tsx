import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Gauge, MapPin, AlertTriangle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const stats = [
  { icon: MapPin, label: 'Active Fields', value: '24' },
  { icon: Gauge, label: 'Ha Monitored', value: '1,200' },
  { icon: AlertTriangle, label: 'Incidents Resolved', value: '98%' },
];

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);
    if ('data' in result && result.data?.token) {
      dispatch(loginSuccess(result.data));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f1f0f 0%, #1a3320 50%, #2d7a22 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #4aad4a 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -right-16 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #4aad4a 0%, transparent 70%)' }} />
          {/* Sugarcane field lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 opacity-5"
              style={{
                left: `${i * 14}%`,
                width: '3px',
                height: `${60 + Math.random() * 30}%`,
                background: 'linear-gradient(to top, transparent, #4aad4a)',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-500/30 border border-forest-400/40 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-forest-300" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">EthioSugar</span>
          </div>
          <p className="text-white/40 text-sm font-medium">Farm Automation System</p>
        </div>

        {/* Middle: Tagline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Powering<br />
            <span className="text-forest-400">Ethiopia's</span><br />
            Sugar Future
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Real-time farm monitoring, incident management, and irrigation automation
            for Ethiopia's sugar belt.
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 space-y-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-8 h-8 rounded-lg bg-forest-500/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-forest-300" />
              </div>
              <span className="text-white/60 text-sm flex-1">{label}</span>
              <span className="text-white font-bold text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">EthioSugar</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your operations portal</p>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                {'status' in error ? 'Invalid email or password' : 'Network error. Check your connection.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="input-field pl-10"
                  placeholder="admin@ethiosugar.com"
                />
              </div>
              {errors.email && <p className="field-error"><span>⚠</span>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  {...register('password')}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="field-error"><span>⚠</span>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
