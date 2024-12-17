"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Feature = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
};

type PaneType = "Dashboard" | "Features" | "Settings";

export default function Home() {
  const [activePane, setActivePane] = useState<PaneType>("Dashboard");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [refreshContent, setRefreshContent] = useState(false);

  const toggleFeature = async (index: string, isActive: boolean) => {
    setFeatures(
      features.map((feature) =>
        feature.id === index ? { ...feature, isActive } : feature
      )
    );
    // Update data
    await fetch("/api/features", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: index,
        isActive,
      }),
    }).then(() => setRefreshContent((prev) => !prev));
  };

  useEffect(() => {
    fetch("/api/features")
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data);
      });
  }, [refreshContent]);

  const addNewFeature = async () => {
    if (newFeatureTitle.trim()) {
      // Create Features
      await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newFeatureTitle,
          description: newFeatureDescription,
          isActive: true,
        }),
      }).then(() => {
        setRefreshContent((prev) => !prev);
      });
      setNewFeatureTitle("");
      setNewFeatureDescription("");
    }
  };

  const PaneContent: Record<PaneType, React.ReactNode> = {
    Dashboard: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features
            .filter((feature) => feature.isActive)
            .map((feature: Feature) => (
              <Card key={feature.id} className="p-3">
                <CardContent>
                  <h3 className="text-lg text-blue-300 font-medium">
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    ),
    Features: (
      <div className="p-4 flex gap-3 justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Features</h2>
          <ul className="space-y-4">
            {features
              .filter((feature) => feature.isActive)
              .map((feature) => (
                displayFeature(feature)
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Inactive Features</h2>
          <ul className="space-y-4">
            {features
              .filter((feature) => !feature.isActive)
              .map((feature) => (
                displayFeature(feature)
              ))}
          </ul>
        </div>
      </div>
    ),
    Settings: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">App Settings</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Toggle Features</h3>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label
                htmlFor={`toggle-${index}`}
                className="flex items-center space-x-2"
              >
                <span>{feature.title}</span>
              </Label>
              <Switch
                id={`toggle-${index}`}
                checked={feature.isActive}
                onCheckedChange={() =>
                  toggleFeature(feature.id, !feature.isActive)
                }
              />
            </div>
          ))}
          <div className="pt-4">
            <h3 className="text-xl font-semibold mb-2">Add New Feature</h3>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="New feature title"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
              />
              <Input
                type="text"
                placeholder="New feature description"
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
              />
              <Button onClick={addNewFeature}>Add</Button>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="border-none rounded-lg overflow-hidden">
      <div className="flex border-b">
        {(Object.keys(PaneContent) as PaneType[]).map((pane) => (
          <Button
            key={pane}
            variant={activePane === pane ? "default" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActivePane(pane)}
          >
            {pane}
          </Button>
        ))}
      </div>
      <div className="min-h-[300px]">{PaneContent[activePane]}</div>
    </div>
  );

  function displayFeature(feature: Feature) {
    return <li key={feature.id} className="flex items-center">
      <h3 className="text-lg font-normal">{feature.title}</h3>
    </li>;
  }
}
