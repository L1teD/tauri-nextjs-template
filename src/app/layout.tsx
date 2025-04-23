"use client";

import "@/styles/globals.css";
import AppWindow from "@/components/AppWindow";
import { readDir, BaseDirectory } from "@tauri-apps/plugin-fs"
import { redirect } from "next/navigation";
import { useEffect } from "react";

async function checkOsuDir() {
    const osuFolder = await readDir("osu!", { baseDir: BaseDirectory.LocalData as BaseDirectory });
    const requiredFiles = ["osu!.exe", "Songs", "Replays", "Skins"]
    const isPathCorrect = osuFolder.filter(filename => requiredFiles.includes(filename.name)).length === requiredFiles.length

    return isPathCorrect;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased`}
            >
                <AppWindow>
                    {children}
                </AppWindow>
            </body>
        </html>
    );
}
