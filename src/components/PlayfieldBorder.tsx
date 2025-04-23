import { circleSizeToScale } from "@osujs/math";

const PlayfieldBorder = () => {
    const cs4 = circleSizeToScale(4) * 64
    const DEFAULT_COLOR = 0xffffff;
    const DEFAULT_ALPHA = 0.7;

    const offsetX = cs4;
    const offsetY = cs4 / (4.0 / 3);


    return (
        <pixiGraphics
            draw={graphics => {
                // https://github.com/abstrakt8/rewind/blob/master/libs/osu-pixi/classic-components/src/playfield/PlayfieldBorder.ts#1
                graphics.clear();
                graphics.setStrokeStyle({
                    width: 5,
                    color: DEFAULT_COLOR,
                    alpha: DEFAULT_ALPHA
                }); // Толщина линии и цвет
                graphics.rect(-offsetX, -offsetY, 512 + offsetX * 2, 384 + offsetY * 2); // Прямоугольник
                graphics.stroke()
            }}
        />
    )
}

export default PlayfieldBorder;