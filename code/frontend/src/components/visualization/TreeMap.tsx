import * as React from "react";
import Paper from "@mui/material/Paper";
import { Tooltip, Treemap } from "recharts";
import { Container } from "@mui/material";
import { CSSProperties} from "react";

export interface TreeMapProps {
  wordData: any;
}

const formattedData = (data: any) => {
    return data.map((item: any) => ({
        name: item.text,
        size: item.value,
    }));
}

interface CustomTooltipProps {
    active: boolean;
    payload: any[];
}

const TreeMapTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload) {
        return (
        <div
            className="tree-map-tooltip"
            style={
            {
                backgroundColor: 'white',
                padding: '5px',
                border: '1px solid black',
            } as CSSProperties
            }
        >
            <p>{`Word: ${payload[0].payload.name}`}</p>
            <p>{`Count: ${payload[0].payload.size}`}</p>
        </div>
        );
    }
    return null;
};

const TreeMap: React.FC<TreeMapProps> = ({ wordData }) => {
    const formatted = formattedData(wordData);
    return (
    <Container>
        <Paper>
        <Treemap
            width={1150}
            height={200}
            data={formatted}
            aspectRatio={16/9}
            dataKey="size"
            stroke="#fff"
            fill="#1976d2"
        >
        <Tooltip content={<TreeMapTooltip active={true} payload={formatted} />} cursor={{ fill: "transparent" }} />
        </Treemap>
        </Paper>
    </Container>
    );
};

export default TreeMap;
