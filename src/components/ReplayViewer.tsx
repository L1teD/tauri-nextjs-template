import { readFile } from "@tauri-apps/plugin-fs"
import { Beatmap, BeatmapDecoder, ScoreDecoder, Score, HitObject } from "osu-parsers"
import { useState, useEffect, useMemo } from "react"
import Cursor from "./Cursor"
import Hitcircle from "./Hitcircle"
import { useTick } from "@pixi/react"
import PlayfieldBorder from "./PlayfieldBorder"

const ReplayViewer = ({ timeElapsed, setTimeElapsed, isPaused, beatmap, score, scale }: {
    timeElapsed: number,
    setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
    isPaused: boolean,
    beatmap: Beatmap,
    score: Score,
    scale: number
}) => {
    const visibleHitObjects = useMemo(() => {
        return beatmap.hitObjects.filter(
            (obj) => obj.startTime > timeElapsed - 3000 && obj.startTime < timeElapsed + 3000
        );
    }, [beatmap.hitObjects, timeElapsed]);

    useTick(ticker => {
        if (!isPaused) setTimeElapsed(prev => prev + ticker.deltaMS)
    })

    return (
        <pixiContainer>
            {visibleHitObjects.map((hitObject, i) => (
                <Hitcircle
                    key={i}
                    x={hitObject.startPosition.x}
                    y={hitObject.startPosition.y}
                    startTime={hitObject.startTime}
                    timeElapsed={timeElapsed}
                    type={hitObject.hitType}
                    approachRate={beatmap.difficulty.approachRate}
                    circleSize={beatmap.difficulty.circleSize}
                    zIndex={beatmap.totalLength - hitObject.startTime}
                />
            ))}

            <Cursor
                frames={score.replay.frames}
                timeElapsed={timeElapsed}
            />
            <PlayfieldBorder />
        </pixiContainer>
    );
};


export default ReplayViewer;