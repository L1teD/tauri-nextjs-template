"use client"

import { readDir, BaseDirectory } from "@tauri-apps/plugin-fs"
import { useState } from "react";

const Page = () => {
    const [checked, setChecked] = useState<boolean | null>(null);
    const checkOsuDir = async () => {
        try {
            const osuFolder = await readDir("osu!", { baseDir: BaseDirectory.LocalData as BaseDirectory });
            const requiredFiles = ["osu!.exe", "Songs", "Replays", "Skins"]
            const isPathCorrect = osuFolder.filter(filename => requiredFiles.includes(filename.name)).length === requiredFiles.length
            setChecked(isPathCorrect);
            setTimeout(() => {
                setChecked(null)
            }, 1000)
        } catch (error) {
            console.error("Failed to read osu! directory:", error);
        }
    }
    return (
        <div>
            <button
                onClick={() => { void checkOsuDir(); }}
                className="p-1 bg-zinc-400 text-black rounded hover:bg-zinc-300 transition-all"
            >
                Check osu! dir
            </button>
            <span>{(checked && <span>osu! path correct</span>) ?? "Click to check osu! dir"}</span>
        </div>
    )
}
 
export default Page;