import { Texture, Assets } from "pixi.js"
import { useState, useEffect, useMemo } from "react"

const animationDuration = 450 // AR10

const Hitcircle = ({
    x,
    y,
    startTime,
    timeElapsed,
    type
}: {
    x: number,
    y: number,
    startTime: number,
    timeElapsed: number,
    type: unknown
}) => {
    const [hitcircle, setHitcircle] = useState<Texture | undefined>()
    const [approachcircle, setApproachcircle] = useState<Texture | undefined>()
    const [hitcircleoverlay, setHitcircleoverlay] = useState<Texture | undefined>()

    console.log(type)

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

    const { acAlpha, acScale } = useMemo(() => {
        if (timeElapsed < startTime && timeElapsed >= startTime - animationDuration) {
            const progress = (timeElapsed - (startTime - animationDuration)) / animationDuration
            return {
                acAlpha: progress,
                acScale: -2 * progress + 3
            }
        } else if (timeElapsed >= startTime) {
            return {
                acAlpha: 0,
                acScale: 1 // или другой дефолт
            }
        } else {
            return {
                acAlpha: 0,
                acScale: 0
            }
        }
    }, [timeElapsed, startTime])

    const radius = 54.4 - 4.48 * 4

    return (
        <pixiContainer x={x} y={y} width={radius} height={radius} scale={0.55}>
            <pixiSprite
                texture={hitcircle}
                anchor={0.5}
                alpha={acAlpha}
            />
            <pixiSprite
                texture={hitcircleoverlay}
                anchor={0.5}
                alpha={acAlpha}
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
