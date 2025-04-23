import { useEffect, useMemo, useState } from "react";
import { Assets, Texture } from "pixi.js";

const Cursor = ({
    frames,
    timeElapsed,
}: {
    frames: {
        startTime: number;
        position: { x: number; y: number };
    }[];
    timeElapsed: number;
}) => {
    const [cursorTexture, setCursorTexture] = useState<Texture | undefined>();

    useEffect(() => {
        async function load() {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const texture = await Assets.load("/Skins/RewindDefaultSkin/cursor.png") as Texture;
            setCursorTexture(texture);
        }
        void load();
    }, []);

    const cursorPos = useMemo(() => {
        const pastFrames = frames.filter(f => f.startTime <= timeElapsed);
        const lastFrame = pastFrames[pastFrames.length - 1];
        const nextFrame = frames.find(f => f.startTime > timeElapsed);


        // Если есть следующий фрейм, то интерполируем между текущим и следующим
        if (nextFrame) {
            const frameDuration = nextFrame.startTime - lastFrame.startTime;
            const progress = (timeElapsed - lastFrame.startTime) / frameDuration;

            const x = lastFrame.position.x + (nextFrame.position.x - lastFrame.position.x) * progress;
            const y = lastFrame.position.y + (nextFrame.position.y - lastFrame.position.y) * progress;

            return { x, y };
        }

        return {
            x: lastFrame.position.x,
            y: lastFrame.position.y,
        };
    }, [frames, timeElapsed]);

    return (
        <pixiContainer x={cursorPos.x} y={cursorPos.y}>
            <pixiSprite texture={cursorTexture} anchor={0.5} />
        </pixiContainer>
    );
};

export default Cursor;
