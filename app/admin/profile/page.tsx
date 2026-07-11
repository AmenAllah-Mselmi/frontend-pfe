import { ProfileForm } from "@/components/ProfileForm";

export const metadata = {
  title: "Mon Profil | Manager CRM",
  description: "Gérer mon profil utilisateur",
};

export default function AdminProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">
          Consultez et mettez à jour vos informations personnelles.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
