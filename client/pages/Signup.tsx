import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Globe, Upload, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nativeLanguages: string[];
  targetLanguages: string[];
  experienceLevel: string;
  profilePicture: File | null;
  videoIntro: File | null;
  agreeToTerms: boolean;
}

const LANGUAGE_OPTIONS = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian",
  "Chinese (Mandarin)", "Japanese", "Korean", "Arabic", "Hindi", "Dutch", "Swedish",
  "Norwegian", "Danish", "Finnish", "Polish", "Czech", "Hungarian", "Turkish",
  "Greek", "Hebrew", "Thai", "Vietnamese", "Indonesian", "Tagalog", "Swahili"
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (A1-A2)" },
  { value: "intermediate", label: "Intermediate (B1-B2)" },
  { value: "advanced", label: "Advanced (C1-C2)" },
  { value: "native", label: "Native Speaker" }
];

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nativeLanguages: [],
    targetLanguages: [],
    experienceLevel: "",
    profilePicture: null,
    videoIntro: null,
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageToggle = (language: string, type: 'native' | 'target') => {
    const key = type === 'native' ? 'nativeLanguages' : 'targetLanguages';
    const currentLanguages = formData[key];
    
    if (currentLanguages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        [key]: currentLanguages.filter(lang => lang !== language)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [key]: [...currentLanguages, language]
      }));
    }
  };

  const handleFileUpload = (file: File, type: 'profilePicture' | 'videoIntro') => {
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.nativeLanguages.length === 0) {
        throw new Error("Please select at least one native language");
      }

      if (formData.targetLanguages.length === 0) {
        throw new Error("Please select at least one target language");
      }

      if (!formData.experienceLevel) {
        throw new Error("Please select your experience level");
      }

      if (!formData.agreeToTerms) {
        throw new Error("Please agree to the terms of service");
      }

      // Submit to API
      const response = await api.createUserProfile({
        name: formData.name,
        email: formData.email,
        nativeLanguages: formData.nativeLanguages,
        targetLanguages: formData.targetLanguages,
        experienceLevel: formData.experienceLevel,
        profilePicture: formData.profilePicture?.name,
        videoIntro: formData.videoIntro?.name,
      });

      // Create user object and login
      const userData = {
        id: response.data?.id || Date.now().toString(),
        name: formData.name,
        email: formData.email,
        nativeLanguages: formData.nativeLanguages,
        targetLanguages: formData.targetLanguages,
        experienceLevel: formData.experienceLevel,
        profilePicture: formData.profilePicture?.name,
        videoIntro: formData.videoIntro?.name,
        referralId: response.data?.referralId || `LK-${Date.now().toString(36).toUpperCase()}`,
        joinedAt: new Date(),
      };

      login(userData);

      // Show success toast
      toast({
        title: "✅ Submission successful!",
        description: "Welcome to LanguageKonnect! Your profile has been created.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        nativeLanguages: [],
        targetLanguages: [],
        experienceLevel: "",
        profilePicture: null,
        videoIntro: null,
        agreeToTerms: false
      });

      // Redirect to leaderboard after short delay
      setTimeout(() => {
        navigate("/leaderboard");
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LanguageKonnect
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" aria-label="Login to LanguageKonnect">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join LanguageKonnect
            </h1>
            <p className="text-muted-foreground">
              Create your profile to start connecting with language learners worldwide
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>
                Fill out your information to get started on your language learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      aria-label="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      aria-label="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      aria-label="Enter your password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      aria-label="Confirm your password"
                      required
                    />
                  </div>
                </div>

                {/* Native Languages */}
                <div className="space-y-3">
                  <Label>Native Language(s) *</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border rounded-md">
                    {LANGUAGE_OPTIONS.map((language) => (
                      <Badge
                        key={language}
                        variant={formData.nativeLanguages.includes(language) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleLanguageToggle(language, 'native')}
                      >
                        {language}
                        {formData.nativeLanguages.includes(language) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.nativeLanguages.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.nativeLanguages.join(", ")}
                    </p>
                  )}
                </div>

                {/* Target Languages */}
                <div className="space-y-3">
                  <Label>Target Language(s) *</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border rounded-md">
                    {LANGUAGE_OPTIONS.map((language) => (
                      <Badge
                        key={language}
                        variant={formData.targetLanguages.includes(language) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleLanguageToggle(language, 'target')}
                      >
                        {language}
                        {formData.targetLanguages.includes(language) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.targetLanguages.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.targetLanguages.join(", ")}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select 
                    value={formData.experienceLevel} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger aria-label="Select your experience level">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profilePicture')}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                      <Label htmlFor="profilePicture" className="cursor-pointer text-sm text-muted-foreground">
                        {formData.profilePicture ? formData.profilePicture.name : "Click to upload image"}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoIntro">Video Introduction</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <Input
                        id="videoIntro"
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'videoIntro')}
                        className="hidden"
                        aria-label="Upload video introduction"
                      />
                      <Label htmlFor="videoIntro" className="cursor-pointer text-sm text-muted-foreground">
                        {formData.videoIntro ? formData.videoIntro.name : "Click to upload video"}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                    aria-label="Agree to terms of service"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-label="Create your LanguageKonnect account"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
