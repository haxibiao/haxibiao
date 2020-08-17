import React from 'react';
import * as ART from '@react-native-community/art';
import { Adapter } from './Adapter';

const Adp = Adapter.shared;

export default function SvgIcon(props:  {
    name: string[],
    size?: number,
    color?: string,
    scale?: number,
    __debugBG?: string,
    offset?: {
        x?: number,
        y?: number
    },
    shadowColor?: string,
    shadowRadius?: number,
    ShadowOffsetX?: number,
    ShadowOffsetY?: number
}) {

    let n = props.name;
    let size = props.size ?? Adp.dp(28);
    let color = props.color ?? "#222";
    let scale = props.scale ?? 0.028;
    let debugBG = props.__debugBG ?? "transparent";
    let x = props.offset?.x ?? 0;
    let y = props.offset?.y ?? 0;
    let shadowColor = props?.shadowColor ?? "transparent";
    let shadowRadius = props?.shadowRadius ?? 0;
    let ShadowOffsetX = props?.ShadowOffsetX ?? 0;
    let ShadowOffsetY = props?.ShadowOffsetY ?? 0;

    return (
        <ART.Surface height={size} width={size} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: debugBG }}>
            <ART.Group>
                {
                    n.map((item: string, index: number) => {
                        if (shadowRadius == 0) {
                            return <ART.Shape
                                key={index.toString()}
                                d={item}
                                fill={color}
                                stroke={color}
                                height={size}
                                scale={scale}
                                x={x}
                                y={y}
                            />
                        }
                        return <ART.Shape
                            key={index.toString()}
                            d={item}
                            fill={color}
                            stroke={color}
                            height={size}
                            scale={scale}
                            x={x}
                            y={y}
                            shadowColor={shadowColor}
                            shadowRadius={shadowRadius}
                            shadowOffset={{ x: ShadowOffsetX, y: ShadowOffsetY }}
                        />

                    })
                }
            </ART.Group>
        </ART.Surface>
    )
}
