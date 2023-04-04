import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import * as React from "react";

export interface ISelectedListItemsProps {
  data: any;
}

export function SelectedListItems(props: ISelectedListItemsProps) {
  return (
    <>
      {props.data.map((item: any) => (
        <ListItem alignItems="flex-start">
          {/* <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
          <ListItemText
            primary={item.name}
            secondary={
              <React.Fragment>
                {Object.keys(item).map((key: any) => (
                  <Typography>{`${key}:${JSON.stringify(
                    item[key]
                  )}`}</Typography>
                ))}
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </>
  );
}
