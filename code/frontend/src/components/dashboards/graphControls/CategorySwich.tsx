import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component={"span"}>{children}</Typography>
      )}
    </div>
  );
}

interface Category {
  name: string;
  content: React.ReactNode;
}

interface Props {
  categories: Category[];
}

export default function CategorySwitcher({ categories }: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        {categories.map((category, index) => (
          <Tab key={category.name} label={category.name} />
        ))}
      </Tabs>
      {categories.map((category, index) => (
        <TabPanel key={category.name} value={value} index={index}>
          {category.content}
        </TabPanel>
      ))}
    </>
  );
}
