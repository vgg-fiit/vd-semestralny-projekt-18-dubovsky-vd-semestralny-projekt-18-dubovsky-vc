import * as React from "react";
import Paper from "@mui/material/Paper";
import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { Container } from "@mui/material";
import { CSSProperties } from "react";

export interface TreeMapProps {
  wordData: any;
}

const formattedData = (data: any) => {
  return data.map((item: any) => ({
    name: item.text,
    size: item.value,
    fill: getColorByCount(item.value),
  }));
};

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
            backgroundColor: "white",
            // padding: "5px",
            // border: "1px solid black",
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

const getColorByCount = (count: number) => {
  if (count <= 1) {
    return "#97b579";
  } else if (count < 3) {
    return "#b4b579";
  } else if (count < 5) {
    return "#b59279";
  } else {
    return "#b57979";
  }
};

const TreeMap: React.FC<TreeMapProps> = ({ wordData }) => {
  const formatted = formattedData(wordData);
  return (
    <Container>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={formatted}
          aspectRatio={16 / 9}
          dataKey="size"
          stroke="#fff"
          fill="white"
        >
          <Tooltip
            content={<TreeMapTooltip active={true} payload={formatted} />}
            cursor={{ fill: "transparent" }}
          />
        </Treemap>
      </ResponsiveContainer>
    </Container>
  );
};

export default TreeMap;
