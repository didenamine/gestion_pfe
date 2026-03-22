"use client"

import { useState, useEffect } from "react"
import { getProfile } from "@/services/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Phone, ShieldCheck, Briefcase, GraduationCap } from "lucide-react"

export function ProfileModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProfile();
      if (resp.success) {
        setUser(resp.data.user);
      } else {
        setError(resp.message || "Failed to load profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profil Utilisateur</DialogTitle>
          <DialogDescription>
            Consultez vos informations personnelles ci-dessous.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-destructive">
            <p>{error}</p>
            <button 
              onClick={fetchData} 
              className="mt-2 text-primary hover:underline text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : user ? (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-500" />
                  {user.role}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-muted-foreground">{user.phoneNumber || "Non renseigné"}</p>
                </div>
              </div>

              {user.profile && (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Diplôme</p>
                      <p className="text-muted-foreground">
                        {user.profile.degree} ({user.profile.degreeType})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Entreprise</p>
                      <p className="text-muted-foreground">{user.profile.companyName || "Non renseigné"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
