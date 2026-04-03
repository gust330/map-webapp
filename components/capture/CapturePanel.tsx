"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextCapture } from "@/components/capture/TextCapture";
import { Type, Mic, ImageIcon } from "lucide-react";

export function CapturePanel() {
    return (
        <div className="mx-auto max-w-2xl relative">
            {/* Ambient background glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-2xl opacity-50" />
            
            {/* Glassmorphism card */}
            <div className="relative rounded-2xl glass-card p-6">
                <Tabs defaultValue="text" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <TabsTrigger
                            value="text"
                            className="gap-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
                        >
                            <Type className="size-4" />
                            Texto
                        </TabsTrigger>
                        <TabsTrigger
                            value="voice"
                            disabled
                            className="gap-2 opacity-50 cursor-not-allowed"
                        >
                            <Mic className="size-4" />
                            Voz
                        </TabsTrigger>
                        <TabsTrigger
                            value="image"
                            disabled
                            className="gap-2 opacity-50 cursor-not-allowed"
                        >
                            <ImageIcon className="size-4" />
                            Imagem
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="mt-0">
                        <TextCapture />
                    </TabsContent>

                    <TabsContent value="voice" className="mt-0">
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                            <Mic className="size-10 text-[#a1a1aa]/40" />
                            <p className="text-sm text-[#a1a1aa]">
                                Captura por voz — <span className="text-[#06b6d4]">Sprint 5</span>
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="image" className="mt-0">
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                            <ImageIcon className="size-10 text-[#a1a1aa]/40" />
                            <p className="text-sm text-[#a1a1aa]">
                                Captura por imagem — <span className="text-[#06b6d4]">Sprint 5</span>
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
