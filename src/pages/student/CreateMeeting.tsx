import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { createMeeting } from "@/services/meetings";
import { Field, FieldLabel } from "@/components/ui/field";

export default function CreateMeeting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: "",
    agenda: "",
    referenceType: "user_story",
    referenceId: "",
  });

  const handleCancel = () => {
    navigate("/student/meetings");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMeeting(formData);
      navigate("/student/meetings");
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to create meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="h-full border-0 shadow-none md:border md:shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Créer une Nouvelle Réunion</CardTitle>
            <CardDescription>
              Remplissez les détails ci-dessous pour planifier une réunion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <Field>
                <FieldLabel className="text-sm font-semibold">Date et Heure</FieldLabel>
                <Input
                  type="datetime-local"
                  required
                  className="w-full"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-sm font-semibold">Type de Référence</FieldLabel>
                  <Select
                    value={formData.referenceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, referenceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user_story">User Story</SelectItem>
                      <SelectItem value="task">Tâche</SelectItem>
                      <SelectItem value="report">Rapport</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold">ID de Référence</FieldLabel>
                  <Input
                    placeholder="Ex: US-001"
                    required
                    value={formData.referenceId}
                    onChange={(e) =>
                      setFormData({ ...formData, referenceId: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-sm font-semibold">Ordre du jour (Agenda)</FieldLabel>
                <Textarea
                  placeholder="Détails de la réunion..."
                  required
                  className="min-h-[150px] resize-y"
                  value={formData.agenda}
                  onChange={(e) =>
                    setFormData({ ...formData, agenda: e.target.value })
                  }
                />
              </Field>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" size="lg" disabled={loading} className="px-8">
              {loading ? "Création en cours..." : "Créer la Réunion"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
