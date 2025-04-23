import { Texture, Assets } from "pixi.js"
import { useState, useEffect, useMemo } from "react"
import { circleSizeToScale } from "@osujs/math"

const animationDuration = 450 // AR10

const Hitcircle = ({
    x,
    y,
    startTime,
    timeElapsed,
    type,
    approachRate,
    circleSize,
    zIndex
}: {
    x: number,
    y: number,
    startTime: number,
    timeElapsed: number,
    type: unknown,
    approachRate: number,
    circleSize: number,
    zIndex: number
}) => {
    const [hitcircle, setHitcircle] = useState<Texture | undefined>()
    const [approachcircle, setApproachcircle] = useState<Texture | undefined>()
    const [hitcircleoverlay, setHitcircleoverlay] = useState<Texture | undefined>()

    let preempt: number;
    let fadeIn: number;
    const fadeOut = 240

    if (approachRate < 5) preempt = 1200 + 600 * (5 - approachRate) / 5
    if (approachRate === 5) preempt = 1200
    if (approachRate > 5) preempt = 1200 - 750 * (approachRate - 5) / 5

    if (approachRate < 5) fadeIn = 800 + 400 * (5 - approachRate) / 5
    if (approachRate === 5) fadeIn = 800
    if (approachRate > 5) fadeIn = 800 - 500 * (approachRate - 5) / 5

    useEffect(() => {
        async function loadTexture() {
            const hitcircle: Texture = await Assets.load("/Skins/RewindDefaultSkin/hitcircle@2x.png")
            const hitcircleoverlay: Texture = await Assets.load("/Skins/RewindDefaultSkin/hitcircleoverlay@2x.png")
            const approachcircle: Texture = await Assets.load("/Skins/RewindDefaultSkin/approachcircle.png")

            setHitcircle(hitcircle)
            setHitcircleoverlay(hitcircleoverlay)
            setApproachcircle(approachcircle)
        }
        void loadTexture()
    }, [])

    const { hcScale, hcAlpha, acAlpha, acScale } = useMemo(() => {
        if (timeElapsed < startTime && timeElapsed >= startTime - preempt) {
            const fadeInProgress = Math.min(1, (timeElapsed - (startTime - preempt)) / fadeIn)
            const approachProgress = (timeElapsed - (startTime - preempt)) / preempt
            return {
                hcAlpha: fadeInProgress,
                acAlpha: fadeInProgress,
                acScale: -2 * approachProgress + 3,
                hcScale: 1
            }
        } else if (timeElapsed >= startTime) {
            return {
                hcAlpha: Math.max(0, 1 - (timeElapsed - startTime) / fadeOut),
                acAlpha: 0,
                acScale: 1,
                hcScale: 1.4 - 0.4 * Math.max(0, 1 - (timeElapsed - startTime) / fadeOut)
            }
        } else {
            return {
                hcAlpha: 0,
                acAlpha: 0,
                acScale: 0,
                hcScale: 0
            }
        }
    }, [timeElapsed, startTime])

    const radius = 54.4 - 4.48 * 4

    return (
        <pixiContainer x={x} y={y} scale={circleSizeToScale(circleSize)} zIndex={zIndex}>
            <pixiSprite
                texture={hitcircle}
                anchor={0.5}
                alpha={hcAlpha}
                scale={hcScale}
            />
            <pixiSprite
                texture={hitcircleoverlay}
                anchor={0.5}
                alpha={hcAlpha}
                scale={hcScale}
            />
            <pixiSprite
                texture={approachcircle}
                scale={acScale}
                anchor={0.5}
                alpha={acAlpha}
            />
        </pixiContainer>
    )
}

export default Hitcircle
