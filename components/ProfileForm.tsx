"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { User, Mail, Building2, Lock, ShieldCheck, Save, Camera } from "lucide-react";

export function ProfileForm() {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        company: user.company || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { 
        name: formData.name, 
        email: formData.email, 
        company: formData.company 
      };
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      await updateProfile(payload);
      
      toast.success("Votre profil a été mis à jour avec succès.");
      
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      toast.error(err.message || "Impossible de mettre à jour le profil.");
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 mb-12">
      {/* Header Profile Section */}
      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {getInitials(user.name)}
          </div>
          <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
            <Camera size={16} />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left pt-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
          <p className="text-gray-500 capitalize flex items-center justify-center sm:justify-start gap-2 mt-1.5 font-medium">
            <ShieldCheck size={16} className={user.role?.toLowerCase() === 'rep' ? 'text-green-500' : 'text-blue-500'} />
            {user.role?.toLowerCase() === 'admin' ? 'Administrateur' : user.role?.toLowerCase() === 'manager' ? 'Manager' : 'Représentant'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
          <ShieldCheck size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Informations Générales */}
        <div className="md:col-span-7">
          <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={18} />
                </div>
                Informations Personnelles
              </CardTitle>
              <CardDescription className="pt-1">
                Mettez à jour vos informations de base et vos coordonnées.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Nom complet</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    required
                    className="pl-11 border-gray-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl h-11"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Adresse e-mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.com"
                    required
                    className="pl-11 border-gray-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700 font-medium">Entreprise</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Nom de votre entreprise"
                    className="pl-11 border-gray-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sécurité */}
        <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
          <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Lock size={18} />
                </div>
                Sécurité du compte
              </CardTitle>
              <CardDescription className="pt-1">
                Gérez votre mot de passe et l'accès au compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Nouveau mot de passe</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Laisser vide pour conserver l'actuel"
                    className="pl-11 border-gray-200 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl h-11"
                  />
                </div>
                <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
                  Laissez ce champ vide si vous ne souhaitez pas modifier votre mot de passe actuel.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action de sauvegarde */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 transition-all rounded-xl px-8 h-12 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span className="font-semibold text-[15px]">
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
