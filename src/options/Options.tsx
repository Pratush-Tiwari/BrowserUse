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
import { Switch } from "./components/ui/switch";
import { Separator } from "./components/ui/separator";
import { auth } from "../lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";

interface ExtensionSettings {
  autoFill: boolean;
  showNotifications: boolean;
  fillDelay: number;
  matchThreshold: number;
}

const Options: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ExtensionSettings>({
    autoFill: false,
    showNotifications: true,
    fillDelay: 100,
    matchThreshold: 0.7,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Load saved settings
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["blurmySettings"], (result) => {
        if (result.blurmySettings) {
          setSettings({ ...settings, ...result.blurmySettings });
        }
      });
    }

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveSettings = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ blurmySettings: settings }, () => {
        console.log("Settings saved");
      });
    }
  };

  const resetSettings = () => {
    const defaultSettings: ExtensionSettings = {
      autoFill: false,
      showNotifications: true,
      fillDelay: 100,
      matchThreshold: 0.7,
    };
    setSettings(defaultSettings);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ blurmySettings: defaultSettings });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blurmy Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your job application automation preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Your Blurmy account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Not signed in</p>
                    <Button
                      onClick={() =>
                        window.open(
                          chrome.runtime.getURL("popup.html"),
                          "_blank"
                        )
                      }
                    >
                      Open Blurmy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Filling Settings</CardTitle>
                <CardDescription>
                  Configure how Blurmy fills out job applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-fill">Auto-fill on page load</Label>
                    <p className="text-sm text-gray-600">
                      Automatically fill forms when visiting job application
                      pages
                    </p>
                  </div>
                  <Switch
                    id="auto-fill"
                    checked={settings.autoFill}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoFill: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Show notifications</Label>
                    <p className="text-sm text-gray-600">
                      Display success/error messages when filling forms
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.showNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, showNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="fill-delay">Fill delay (ms)</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Delay between filling each field to avoid detection
                  </p>
                  <Input
                    id="fill-delay"
                    type="number"
                    min="0"
                    max="1000"
                    value={settings.fillDelay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        fillDelay: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-32"
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="match-threshold">
                    Field matching threshold
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    How strict field name matching should be (0.0 - 1.0)
                  </p>
                  <Input
                    id="match-threshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.matchThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        matchThreshold: parseFloat(e.target.value) || 0.7,
                      })
                    }
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Profile Data</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Your profile data is stored securely in Firebase
                  </p>
                  <Button variant="outline" size="sm">
                    Export Profile Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label>Clear Data</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Remove all stored data from this extension
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>
                  Extension information and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Version</Label>
                  <p className="text-sm text-gray-600">1.0.0</p>
                </div>
                <div>
                  <Label>Support</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Get help and report issues
                  </p>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={saveSettings} className="flex-1">
                Save Settings
              </Button>
              <Button variant="outline" onClick={resetSettings}>
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
