"use client"
import { useEffect, useState } from "react";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { Beatmap, BeatmapDecoder, Score, ScoreDecoder } from "osu-parsers";
import ReplayViewer from "@/components/ReplayViewer";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import { circleSizeToScale } from "@osujs/math";

extend({ Container, Graphics, Sprite });

const Page = () => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [beatmap, setBeatmap] = useState<Beatmap | null>(null);
    const [score, setScore] = useState<Score | null>(null);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioVolume, setAudioVolume] = useState(0.01);

    const beatmapPath = "osu!/Songs/594170 Avenged Sevenfold - Save Me/Avenged Sevenfold - Save Me (Drummer) [Tragedy].osu";
    const scorePath = "osu!/Replays/L1te_ - Avenged Sevenfold - Save Me [Tragedy] (2023-11-02) Osu.osr";
    const audioPath = "osu!/Songs/594170 Avenged Sevenfold - Save Me/audio.mp3";

    useEffect(() => {
        async function loadData() {
            const scoreBuffer = await readFile(scorePath, { baseDir: BaseDirectory.LocalData });
            const beatmapBuffer = await readFile(beatmapPath, { baseDir: BaseDirectory.LocalData });

            const scoreDecoder = new ScoreDecoder();
            const beatmapDecoder = new BeatmapDecoder();

            const score = await scoreDecoder.decodeFromBuffer(scoreBuffer);
            const beatmap = beatmapDecoder.decodeFromBuffer(beatmapBuffer);

            setScore(score);
            setBeatmap(beatmap);

            const audioBuffer = await readFile(audioPath, { baseDir: BaseDirectory.LocalData });
            const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        }

        void loadData();
    }, []);

    useEffect(() => {
        if (beatmap && audioUrl) {
            const audio = new Audio(audioUrl); // Путь к аудио-файлу
            audio.loop = true; // Аудио будет повторяться
            audio.volume = audioVolume;
            void audio.play();
            setAudio(audio);

            return () => {
                audio.pause(); // Очистка при размонтировании компонента
            };
        }
    }, [beatmap, audioUrl]);

    useEffect(() => {
        if (audio && !isPaused) {
            // Синхронизируем timeElapsed с аудио
            const syncTime = () => {
                setTimeElapsed(audio.currentTime * 1000); // Синхронизация в миллисекундах
            };
            const interval = setInterval(syncTime, 50); // Обновляем каждую 50ms

            return () => {
                clearInterval(interval);
            };
        }
    }, [audio, isPaused]);

    const togglePause = () => {
        if (audio) {
            if (isPaused) {
                void audio.play(); // Возобновляем воспроизведение
            } else {
                audio.pause(); // Ставим на паузу
            }
        }
        setIsPaused(!isPaused);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audio) {
            audio.volume = Number(e.target.value);
            setAudioVolume(Number(e.target.value));
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audio) {
            const newTime = Number(e.target.value) / 1000; // Переводим в секунды
            audio.currentTime = newTime; // Устанавливаем новую позицию в аудио
            setTimeElapsed(Number(e.target.value)); // Обновляем timeElapsed
        }
    };

    const viewerWidth = 1280
    const viewerHeight = 720


    return beatmap && score ? (
        <div>
            <Application
                sharedTicker
                width={viewerWidth}
                height={viewerHeight}
                className="m-5 rounded-xl"
            >
                <pixiContainer x={100} y={100}>
                    <ReplayViewer
                        timeElapsed={timeElapsed}
                        setTimeElapsed={setTimeElapsed}
                        beatmap={beatmap}
                        score={score}
                        isPaused={isPaused}
                        scale={1}
                    />
                </pixiContainer>
            </Application>

            {/* Слайдеры для аудио */}
            <input
                type="range"
                min={0}
                max={beatmap.totalLength} // Максимум по длительности аудио
                value={timeElapsed}
                onChange={handleSeek}
                style={{ width: "100%" }}
            />
            <input
                type="range"
                min={0}
                max={1} // Максимум по длительности аудио
                step={0.01}
                value={audioVolume}
                onChange={handleVolume}
                style={{ width: "10%" }}
            />
            <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
        </div>
    ) : null;
};

export default Page;
