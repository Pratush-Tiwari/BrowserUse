import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Separator } from "./components/ui/separator";
import {
  auth,
  db,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  debugFirebaseAuth,
  testFirebaseWrite,
} from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface UserProfile {
  email: string;
  rawProfileData: string;
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Popup: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debug effect to log profile changes
  useEffect(() => {
    console.log("Profile state changed:", profile);
    console.log("Is editing:", isEditing);
  }, [profile, isEditing]);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading profile for user:", userId);
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Profile found in Firestore:", docSnap.data());
        setProfile(docSnap.data() as UserProfile);
      } else {
        console.log("No profile found, creating default profile");
        // Create default profile with user's email
        const defaultProfile: UserProfile = {
          email: user?.email || "",
          rawProfileData: "",
          apiKey: "",
        };
        setProfile(defaultProfile);

        // Optionally save the default profile to Firestore
        try {
          await setDoc(docRef, {
            ...defaultProfile,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log("Default profile saved to Firestore");
        } catch (saveError) {
          console.error("Error saving default profile:", saveError);
          // Don't throw here - we still want to show the profile even if save fails
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Create a fallback profile even if there's an error
      const fallbackProfile: UserProfile = {
        email: user?.email || "",
        rawProfileData: "",
        apiKey: "",
      };
      setProfile(fallbackProfile);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (authMode === "register" && password !== confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }

    try {
      if (authMode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Provide more user-friendly error messages
      if (error.code === "auth/user-not-found") {
        setAuthError("No account found with this email address");
      } else if (error.code === "auth/wrong-password") {
        setAuthError("Incorrect password");
      } else if (error.code === "auth/email-already-in-use") {
        setAuthError("An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Please enter a valid email address");
      } else if (error.code === "auth/popup-closed-by-user") {
        setAuthError("Login was cancelled");
      } else {
        setAuthError(
          error.message || "Authentication failed. Please try again."
        );
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) {
      console.error("Cannot save profile: user or profile is null", {
        user,
        profile,
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("Attempting to save profile for user:", user.uid);
      console.log("Profile data to save:", profile);

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date(),
      });
      setIsEditing(false);
      console.log("Profile saved successfully");
    } catch (error: any) {
      console.error("Error saving profile:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to save profile. Please try again.";

      if (error.code === "permission-denied") {
        errorMessage =
          "Permission denied. Please check your Firebase security rules.";
      } else if (error.code === "unavailable") {
        errorMessage =
          "Firebase is unavailable. Please check your internet connection.";
      } else if (error.code === "unauthenticated") {
        errorMessage = "You are not authenticated. Please log in again.";
      } else if (error.message) {
        errorMessage = `Save failed: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-96 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-96 p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Blurmy</h1>
          <p className="text-sm text-gray-600">
            Intelligent Job Application Automation
          </p>
        </div>

        <Tabs
          value={authMode}
          onValueChange={(value) => setAuthMode(value as "login" | "register")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="w-96 h-96 overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Blurmy</h1>
            <p className="text-sm text-gray-600">Welcome, {user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>
                    Write all your information in one place. AI will extract the
                    relevant data when filling forms.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      isEditing ? saveProfile() : setIsEditing(true)
                    }
                    disabled={isSaving}
                  >
                    {isEditing ? (isSaving ? "Saving..." : "Save") : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profile-data">Profile Information</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Include your personal details, work experience, education,
                  skills, and any other relevant information.
                </p>
                <textarea
                  id="profile-data"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={12}
                  placeholder="Example: My name is John Doe, I'm a software engineer with 5 years of experience. I graduated from MIT with a Bachelor's in Computer Science in 2019. I currently work at Google as a Senior Software Engineer where I lead a team of 5 developers building scalable web applications. My skills include React, Node.js, Python, and AWS. I have experience with machine learning and have published 3 papers on computer vision. I'm passionate about open source and have contributed to projects like React and TensorFlow. I'm looking for opportunities in AI/ML engineering roles..."
                  value={profile?.rawProfileData || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, rawProfileData: e.target.value } : null
                    )
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="api-key">OpenAI API Key (Optional)</Label>
                <p className="text-sm text-gray-600 mb-2">
                  For enhanced AI capabilities when filling forms
                </p>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={profile?.apiKey || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, apiKey: e.target.value } : null
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extension Settings</CardTitle>
              <CardDescription>Configure how Blurmy works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Debug Firebase</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Test Firebase connection and authentication
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    debugFirebaseAuth();
                    console.log(
                      "Debug info logged to console. Check browser dev tools."
                    );
                  }}
                >
                  Debug Firebase
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Test Firebase Write</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Test if you can write to Firestore
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    const result = await testFirebaseWrite();
                    if (result) {
                      alert("Firebase write test successful!");
                    } else {
                      alert(
                        "Firebase write test failed. Check console for details."
                      );
                    }
                  }}
                >
                  Test Write Permission
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Auto-fill Forms</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Automatically fill job application forms when detected
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Configure Auto-fill
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Data Export</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Export your profile data
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Export Data
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Clear Data</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Remove all stored data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Popup;
