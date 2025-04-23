"use client"
import { Window } from "@tauri-apps/api/window"
import { useEffect, useState } from "react"

import { FaXmark, FaExpand, FaDownLeftAndUpRightToCenter } from "react-icons/fa6"
import { TbAlpha } from "react-icons/tb"

export default function TitleBar() {
    const [appWindow, setAppWindow] = useState<undefined | Window>()

    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).getCurrentWindow()
        setAppWindow(appWindow)
    }

    useEffect(() => {
        void setupAppWindow()
    }, [])

    function windowMinimize() {
        void appWindow?.minimize()
    }
    function windowToggleMaximize() {
        void appWindow?.toggleMaximize()
    }
    function windowClose() {
        void appWindow?.close()
    }

	return (
		<div className="bg-zinc-800 w-full h-full flex justify-between items-center px-2" data-tauri-drag-region>
			<span className="text-white font-aller text-sm select-none flex items-center gap-x-1">osu!RA <TbAlpha className="text-zinc-400" /></span>
			<div className="flex gap-x-2 app-region-nodrag">
				<div className="flex justify-center items-center">
					<div
                        onClick={windowMinimize}
                        className="group p-0.5 aspect-square bg-green-500 w-3 rounded-full hover:bg-green-700 transition-all cursor-pointer"
                    >
                        <FaDownLeftAndUpRightToCenter className="h-full w-full text-green-400 opacity-0 group-hover:opacity-100 transition-all" />
					</div>
				</div>
				<div className="flex justify-center items-center">
					<div
                        onClick={windowToggleMaximize}
                        className="group p-0.5 aspect-square bg-yellow-500 w-3 rounded-full hover:bg-yellow-700 transition-all cursor-pointer"
                    >
                        <FaExpand className="h-full w-full text-yellow-400 opacity-0 group-hover:opacity-100 transition-all" />
					</div>
				</div>
				<div className="flex justify-center items-center">
					<div
                        onClick={windowClose}
                        className="group aspect-square bg-rose-500 w-3 rounded-full hover:bg-rose-700 transition-all cursor-pointer"
                    >
                        <FaXmark className="h-full w-full text-rose-400 opacity-0 group-hover:opacity-100 transition-all" />
					</div>
				</div>	
			</div>
		</div>
	)
}