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
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
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

  const loadUserProfile = async (userId: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          email: user?.email || "",
          rawProfileData: "",
          apiKey: "",
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
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
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
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
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    isEditing ? saveProfile() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
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
