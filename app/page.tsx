"use client";

import { useEffect, useState } from "react";
import { useConfigStore } from "@/store/configStore";
import { BuilderPanels } from "@/components/builder/BuilderPanels";
import { ConfigActions } from "@/components/builder/ConfigActions";
import { LivePreview } from "@/components/preview/LivePreview";
import { ComponentGallery } from "@/components/preview/ComponentGallery";
import { ExportPanel } from "@/components/export/ExportPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

export default function BuilderPage() {
  const config = useConfigStore((s) => s.config);
  // Persisted store hydrates after mount; gate to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] place-items-center text-sm text-muted-foreground">
        Đang tải trình cấu hình…
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[360px_minmax(0,3fr)_minmax(0,2fr)]">
      {/* Left: settings */}
      <aside className="flex min-h-0 flex-col border-r border-border">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold">Theme Config</h1>
          <p className="text-xs text-muted-foreground">
            Định nghĩa design system của bạn. Thay đổi sẽ hiển thị ngay.
          </p>
          <div className="mt-3">
            <ConfigActions />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <BuilderPanels />
        </div>
      </aside>

      {/* Middle + right: on xl two columns, otherwise tabbed */}
      <section className="hidden min-h-0 flex-col overflow-y-auto bg-muted/30 xl:flex">
        <Tabs defaultValue="preview" className="flex min-h-0 flex-1 flex-col">
          <div className="p-4 pb-0">
            <TabsList>
              <TabsTrigger value="preview">Live preview</TabsTrigger>
              <TabsTrigger value="gallery">Thư viện component</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="preview" className="p-4">
            <div className="rounded-lg border border-border bg-background">
              <LivePreview config={config} />
            </div>
          </TabsContent>
          <TabsContent value="gallery" className="p-4">
            <ComponentGallery config={config} />
          </TabsContent>
        </Tabs>
      </section>

      <section className="hidden min-h-0 border-l border-border xl:block">
        <ExportPanel />
      </section>

      {/* Tabbed view for < xl */}
      <section className="min-h-0 xl:hidden">
        <Tabs defaultValue="preview" className="flex h-full flex-col">
          <div className="border-b border-border p-3">
            <TabsList>
              <TabsTrigger value="preview">Live preview</TabsTrigger>
              <TabsTrigger value="gallery">Thư viện component</TabsTrigger>
              <TabsTrigger value="export">Xuất markdown</TabsTrigger>
            </TabsList>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabsContent value="preview" className="p-4">
              <div className="rounded-lg border border-border bg-background">
                <LivePreview config={config} />
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="p-4">
              <ComponentGallery config={config} />
            </TabsContent>
            <TabsContent value="export" className="h-full">
              <ExportPanel />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
}
