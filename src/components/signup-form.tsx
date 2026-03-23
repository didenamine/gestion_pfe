import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  signupStudent,
  signupUniSupervisor,
  signupCompSupervisor,
} from "@/services/auth";

type Role = "Student" | "UniSupervisor" | "CompSupervisor";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [role, setRole] = useState<Role>("Student");
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    cin: "",
    degree: "",
    degreeType: "",
    companyName: "",
    universitySupervisorId: "",
    companySupervisorId: "",
    studentCard: "",
    // Supervisor specific
    badgeIMG: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const baseData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        role: role,
      };

      console.log("Submitting signup data:", baseData);

      if (role === "Student") {
        await signupStudent({
          ...baseData,
          cin: formData.cin,
          degree: formData.degree,
          degreeType: formData.degreeType,
          companyName: formData.companyName,
          universitySupervisorId: formData.universitySupervisorId,
          companySupervisorId: formData.companySupervisorId,
          studentCard: formData.studentCard,
        });
      } else if (role === "UniSupervisor") {
        await signupUniSupervisor({
          ...baseData,
          badgeIMG: formData.badgeIMG,
        });
      } else {
        await signupCompSupervisor({
          ...baseData,
          companyName: formData.companyName,
          badgeIMG: formData.badgeIMG,
        });
      }

      setSuccess("Signup successful! Please login.");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">{success}</h1>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Select your role and fill in the details below
        </p>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <FieldGroup>
        <Field>
          <FieldLabel>Register as</FieldLabel>
          <Select
            value={role}
            onValueChange={(value: Role) => setRole(value)}
          >
            <SelectTrigger className="w-full h-10 border-input bg-background">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="UniSupervisor">University Supervisor</SelectItem>
              <SelectItem value="CompSupervisor">Company Supervisor</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            required
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+123456789"
            required
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </Field>
        </div>

        {/* Role Specific Fields */}
        {role === "Student" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="cin">CIN</FieldLabel>
                <Input
                  id="cin"
                  type="text"
                  required
                  value={formData.cin}
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="degree">Degree</FieldLabel>
                <Input
                  id="degree"
                  type="text"
                  required
                  value={formData.degree}
                  onChange={handleInputChange}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="degreeType">Degree Type</FieldLabel>
              <Input
                id="degreeType"
                type="text"
                required
                value={formData.degreeType}
                onChange={handleInputChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
              <Input
                id="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="universitySupervisorId">Uni Supervisor ID</FieldLabel>
                <Input
                  id="universitySupervisorId"
                  type="text"
                  required
                  value={formData.universitySupervisorId}
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="companySupervisorId">Comp Supervisor ID</FieldLabel>
                <Input
                  id="companySupervisorId"
                  type="text"
                  required
                  value={formData.companySupervisorId}
                  onChange={handleInputChange}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="studentCard">Student ID Card</FieldLabel>
              <Input
                id="studentCard"
                type="text"
                placeholder="Enter ID card info"
                required
                value={formData.studentCard}
                onChange={handleInputChange}
              />
            </Field>
          </>
        )}

        {(role === "UniSupervisor" || role === "CompSupervisor") && (
          <>
            {role === "CompSupervisor" && (
              <Field>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="badgeIMG">Badge</FieldLabel>
              <Input
                id="badgeIMG"
                type="text"
                placeholder="Enter badge info"
                required
                value={formData.badgeIMG}
                onChange={handleInputChange}
              />
            </Field>
          </>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4 font-medium">
            Sign in
          </a>
        </div>
      </FieldGroup>
    </form>
  );
}
