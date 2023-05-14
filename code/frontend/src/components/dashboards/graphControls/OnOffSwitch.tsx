// OnOffSwitch.tsx
import React, { useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";

interface OnOffSwitchProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const OnOffSwitch: React.FC<OnOffSwitchProps> = ({
  label = "On/Off",
  defaultChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label={label}
      />
    </div>
  );
};

export default OnOffSwitch;
